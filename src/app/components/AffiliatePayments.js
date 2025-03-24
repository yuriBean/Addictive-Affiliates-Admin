"use client";
import { useState, useEffect } from "react";
import { fetchBalance, fetchTransactions, getStripeAccount, saveStripeAccount, submitWithdrawalRequest, withdrawFunds } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

export default function AffiliatePayments() {
  const { user } = useAuth();

  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fundSuccessMessage, setFundSuccessMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [instantBalance, setInstantBalance] = useState(0);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {

    if (!user) return;

    const getBalance = async () => {
      if (user.uid){
        const userBalance = await fetchBalance(user.uid);
        const userTransactions = await fetchTransactions (user.uid);
        setBalance(userBalance);
        setTransactions(userTransactions);
      }
    }

    const getStripeAccountId = async () => {
      try{
        const id = await getStripeAccount(user.uid);
        if (id)
          setAccountId(id);
        else
          console.log ("error fetching account id");
      } catch (error) {
        throw error;
      }
    }

    getBalance();
    getStripeAccountId();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const getStripeBalance = async () => {
      if (!accountId) return;

      try{
        const balanceResponse = await axios.post("/api/get-stripe-balance", { accountId });
        const stripeBalance = balanceResponse.data;
    
        const pendingBalance = (stripeBalance.pending?.find(b => b.currency === "usd")?.amount) / 100 || 0;
        const instantBalance = (stripeBalance.instant_available?.find(b => b.currency === "usd")?.amount) /100 || 0;
    
        setPendingBalance(pendingBalance);
        setInstantBalance(instantBalance);    
      } catch (error) {
        throw error;
      }
    }

    getStripeBalance();
  }, [accountId])

  const handleSubmit = async () => {
    setLoading(true);
    
    if (!accountId) {
      setErrorMessage("You need to create and complete Stripe onboarding first.");
      setLoading(false);
      return;
    }

    if (instantBalance === 0) {
      setErrorMessage(`You have no funds to withdraw.`);
      setLoading(false);
      return;
    }

    if (instantBalance < balance.currentBalance) {
      setErrorMessage(`You have insufficient funds. Some funds may be under processing.`);
      setLoading(false);
      return;
    }

    const onboardingCompleted = await axios.post("/api/check-onboarding-status", {
      accountId: accountId,
    });
  
    if (!onboardingCompleted.data.success) {
      setErrorMessage("Please complete your Stripe onboarding before withdrawing funds.");
      setLoading(false);
      return;
    }
    try {
      const payoutResponse = await axios.post("/api/create-payout", {
        accountId: accountId,
        amount: instantBalance,
      });
  
      if (payoutResponse.data.success) {
        setFundSuccessMessage("Funds have been transferred.");
        await withdrawFunds(user.uid, instantBalance);
      } else {
        setErrorMessage("Payout failed: " + payoutResponse.data.error);
      }
    } catch (error) {
      console.error("Payout error:", error);
      setErrorMessage("Error processing withdrawal.");
    }

    setLoading(false);
  };

  const handleWithdrawalRequest = async (transaction) => {
    setLoading(true);

    let accountId = await getStripeAccount(user.uid);
    console.log(accountId);
    
    if (!accountId) {
      console.log('Starting onboarding');
      const accountResponse = await axios.post("/api/create-stripe-account", {
          userId: user.uid,
          email: user.email,
      });

      accountId = accountResponse.data?.account?.id;
      const onboardingUrl = accountResponse.data?.onboardingUrl;

      if (accountId) {
          setStripeAccountId(accountId);
          await saveStripeAccount(user.uid, accountId);
  
          if (onboardingUrl) {
            if (typeof window !== "undefined") {
              window.open(onboardingUrl, "_blank");
            }
              return;
          }
      } else {
          throw new Error("Failed to create Stripe account.");
      }        
    }

    const onboardingCompleted = await axios.post("/api/check-onboarding-status", {
      accountId: accountId,
    });

    if (!onboardingCompleted.data.success) {
        setErrorMessage("Please complete your Stripe onboarding before withdrawing funds.");
        setLoading(false);
        return;
    }

    let success;
    if (onboardingCompleted.data.success) {
    success = await submitWithdrawalRequest(transaction.id, user.email);
    setLoading(false);
    }
    
    if (success) {
      setSuccessMessage("Withdrawal request submitted!");
        setTransactions((prevTransactions) =>
          prevTransactions.map((t) =>
            t.id === transaction.id ? { ...t, status: "requested" } : t
          )
        );
    }
};  

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedTab === "all") return true;
    return transaction.status === selectedTab;
  });

  return (
    <div className="text-black">
      <h1 className="text-2xl md:text-3xl text-headings font-bold mt-4">Payment</h1>
      <p className="text-md md:text-xl mb-4">Manage your payment methods and view transaction history.</p>

      <section className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex justify-between items-center mb-3">
          <div className="mb-6 space-y-2 col-span-1 bg-accent p-6 rounded-lg">
            <p className="text-sm">Current Balance</p>
            <p className="text-2xl font-bold">${balance?.currentBalance?.toFixed(2) || 0.00}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-1 text-gray-500">
              <p className="text-medium text-sm text-gray-600 my-3">Funds under processing can be withdrawn within 2-7 days. If you are experiencing issues withdrawing funds, contact support.</p>
              <small>Pending Balance: ${pendingBalance}</small>
              <small>Available Balance: ${instantBalance}</small>
        </div>
      </section>

      <div className="flex flex-col space-y-6 justify-center">
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {fundSuccessMessage && <p className="text-green-500 text-sm">{fundSuccessMessage}</p>}

          <div className="flex justify-end">
            <button onClick={handleSubmit} disabled={loading} className="bg-secondary text-white py-2 px-6 text-md md:text-xl rounded-md mt-4">
              Withdraw
            </button>
          </div>
      </div>

      <div className="my-4 space-y-3">
        <h2 className="text-secondary font-semibold text-xl">Transactions</h2>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {["all", "completed", "pending", "requested", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full text-sm md:text-md ${selectedTab === tab ? "bg-secondary text-white" : "bg-white border border-secondary hover:bg-secondary hover:text-white text-black"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4 overflow-x-auto">
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

        <table className="min-w-full table-auto mt-4 border-separate border-spacing-3">
        <thead>
        <tr className="border-b text-sm md:text-lg">
        <th className="px-4 py-2 text-left bg-accent rounded">Date</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Amount</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Status</th>
        <th className="px-4 py-2 text-left bg-accent rounded">Withdraw</th>
      </tr>
    </thead>
    <tbody>
      {filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction) => (
          <tr key={transaction.id} className="border-b text-sm md:text-lg">
            <td className="px-4 py-2">{new Date(transaction.date.seconds * 1000).toLocaleDateString()}</td>
            <td className="px-4 py-2">${transaction.amount.toFixed(2)}</td>
            <td className={`px-4 py-2 font-semibold ${transaction.status === "pending" ? "text-yellow-500" : transaction.status === "completed" ? "text-green-500" : "text-red-500"}`}>
              {transaction.status}
            </td>
            <td className="px-4 py-2">
                <button
                  onClick={() => handleWithdrawalRequest(transaction)}
                  className={`py-1 px-3 rounded-md ${
                    transaction.status === "completed" || transaction.status === "requested"
                      ? "bg-gray-400 text-white"
                      : "bg-secondary text-white"
                  }`}
                  disabled = {transaction.status === "requested" || transaction.status === "completed" }
                >
                  {transaction.status === "requested" ? 'Requested' : transaction.status === "completed" ? "Completed" : 'Request Transfer' }
                </button>
            </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">No transactions found</td>
            </tr>
          )}
    </tbody>
  </table>
  </div>
</div>

      </div>
    </div>
  );
}
