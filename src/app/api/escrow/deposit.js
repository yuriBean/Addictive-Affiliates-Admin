import axios from "axios";
import { updateBusinessDeposit } from "@/app/firebase/firestoreService";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, amount, businessEmail } = req.body;

  if (!userId || !amount || amount <= 0 || !businessEmail) {
    return res.status(400).json({ error: "Invalid deposit request" });
  }

  try {
    const ESCROW_SANDBOX_URL = "https://api.escrow-sandbox.com/2017-09-01";
    const ESCROW_API_KEY = process.env.ESCROW_API_KEY;
    const ESCROW_API_SECRET = process.env.ESCROW_API_SECRET;

    // Create an Escrow.com transaction
    const escrowResponse = await axios.post(
      `${ESCROW_SANDBOX_URL}/transaction`,
      {
        currency: "usd",
        parties: [
          { role: "buyer", email: businessEmail }, // Business
          { role: "seller", email: "your-platform@yourdomain.com" }, // Your platform
        ],
        description: "Escrow deposit for affiliate payments",
        amount: amount,
        items: [
          {
            title: "Affiliate Payment Deposit",
            description: "Funds for affiliate commissions",
            type: "service",
            quantity: 1,
            inspection_period: "1 day",
            schedule: [{ amount: amount, beneficiary: "seller" }],
          },
        ],
      },
      {
        auth: {
          username: ESCROW_API_KEY,
          password: ESCROW_API_SECRET,
        },
      }
    );

    const transactionId = escrowResponse.data.id;

    // Update Firestore balance
    const updateSuccess = await updateBusinessDeposit(userId, amount);

    if (!updateSuccess) {
      return res.status(500).json({ error: "Failed to update Firestore balance" });
    }

    return res.status(200).json({
      message: "Escrow deposit initiated",
      transactionId,
    });
  } catch (error) {
    console.error("Escrow deposit error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to initiate escrow deposit" });
  }
}
