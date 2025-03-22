import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, addDoc, getDocs, deleteDoc, collectionGroup, query, where, increment, arrayUnion, Timestamp } from "firebase/firestore"; 
import { app } from './config'; 
import { format } from "date-fns";

const db = getFirestore(app);

export const createUser = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, userData);
        return userData;
      } catch (error) {
        throw error;
      }
};

export const updateFirestoreUserEmail = async (userId, newEmail) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { email: newEmail });
};

export const updateUser = async (userId, userData) => {

  if (!userId) throw new Error("User ID is required.");
  if (!userData || typeof userData !== "object") throw new Error("Valid user data is required.");

  try{
    const userRef = doc(db, 'users', userId)
    const filteredUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
    );

    if (Object.keys(filteredUserData).length > 0) {
      await updateDoc(userRef, filteredUserData);
    }  
  } catch(error){
    throw error;
  }
}

export const getUser = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if(!userSnap.exists())
    throw error("No user found")

  return userSnap.data();
}

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    if (usersSnapshot.empty) {
      console.log("No users found.");
      return [];
    }

    const users = usersSnapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const savePaymentDetails = async (userId, paymentData) => {
  try {
      const paymentRef = doc(db, "payments", userId);
      await setDoc(paymentRef, paymentData, { merge: true });
      console.log("Payment details saved successfully");
  } catch (error) {
      console.error("Error saving payment details:", error);
      throw error;
  }
};

export const addCampaign = async (userId, campaignData) => {
  try {
    const campaignRef = collection(db, "campaigns", userId, "userCampaigns"); 
    const docRef = await addDoc(campaignRef, campaignData);
    console.log("Campaign added successfully!");    
    return docRef.id;
  } catch (error) {
    console.error("Error saving campaign details:", error);
    throw error;
  }
};

export const editCampaign = async (userId, campaignId, updatedData) => {
  try {
    const campaignRef = doc(db, "campaigns", userId, "userCampaigns", campaignId);
    await updateDoc(campaignRef, updatedData);
    console.log("Campaign updated successfully!");
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }
};

export const getCampaign = async (userId, campaignId) => {
  try {
    const campaignRef = doc(db, "campaigns", userId, "userCampaigns", campaignId);
    const docSnap = await getDoc(campaignRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Campaign not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching campaign:", error);
    throw error;
  }
};

export const getCampaignById = async (campaignId) => {
  try {
    const users = await getAllUsers();
    for (const user of users) {
      const campaigns = await getAllUserCampaigns(user.userId);
      const matchedCampaign = campaigns.find(campaign => campaign.id === campaignId);
      if (matchedCampaign) {
        return matchedCampaign;
      }
    }

    console.log("Campaign not found.");
    return null;
  } catch (error) {
    console.error("Error fetching campaign:", error);
    throw error;
  }
};

export const getAllUserCampaigns = async (userId) => {
  try {
    const campaignRef = collection(db, "campaigns", userId, "userCampaigns");
    const querySnapshot = await getDocs(campaignRef);
    const campaigns = [];
    querySnapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...doc.data() });
    });
    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const getAllCampaigns = async () => {
  try {
    const campaignsSnapshot = await getDocs(collectionGroup(db, "userCampaigns"));
    return campaignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const deleteCampaign = async (userId, campaignId) => {
  try {
    const campaignRef = doc(db, "campaigns", userId, "userCampaigns", campaignId);
    await deleteDoc(campaignRef);
    console.log("Campaign deleted successfully!");
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw error;
  }
};

export const updateCampaignStatus = async (userId, campaignId, isActive) => {
  try { 
    const campaignRef = doc(db, "campaigns", userId, "userCampaigns", campaignId);
    await updateDoc(campaignRef, { isActive });
    console.log("Campaign updated successfully!");
  } catch (error) {
    console.error("Error updating campaign status:", error);
  }
};

export const addProduct = async (campaignId, productData) => {
  try {
    const productRef = collection(db, "products", campaignId, "campaignProducts"); 
    await addDoc(productRef, productData);
    console.log("Product added successfully!");    
  } catch (error) {
    console.error("Error saving product details:", error);
    throw error;
  }
};

export const editProduct = async (campaignId, productId, updatedData) => {
  try {
    const productRef = doc(db, "products", campaignId, "campaignProducts", productId);
    await updateDoc(productRef, updatedData);
    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const getProduct = async (productId, campaignId) => {
  try {
    const productRef = doc(db, "products", campaignId, "campaignProducts", productId);
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Product not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getAllProductsInCampaign = async (campaignId) => {
  try {
    const productRef = collection(db, "products", campaignId, "campaignProducts");
    const querySnapshot = await getDocs(productRef);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteProduct = async (productId, campaignId) => {
  try {
    const productRef = doc(db, "products", campaignId, "campaignProducts", productId);
    await deleteDoc(productRef);
    console.log("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const updateProductStatus = async (productId, campaignId, isActive) => {
  try { 
    const productRef = doc(db, "products", campaignId, "campaignProducts", productId);
    await updateDoc(productRef, { isActive });
    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product status:", error);
  }
};

export const getAllProducts = async () => {
  try {
    const productsSnapshot = await getDocs(collectionGroup(db, "campaignProducts"));
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductsByCampaign = async (campaignId) => {
  try {
    const q = query(
      collection(db, "products", campaignId, "campaignProducts"),
    );
    const productsSnapshot = await getDocs(q);
    return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductsByUser = async (userId) => {
  try {
    const campaigns = await getAllUserCampaigns(userId);
    let allProducts = [];

    for (const campaign of campaigns) {
      const productsRef = collection(db, "products", campaign.id, "campaignProducts");
      const productsSnapshot = await getDocs(productsRef);

      const products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        campaignId: campaign.id, 
      }));

      allProducts = [...allProducts, ...products]; 
    }

    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const bulkAddProducts = async (campaignId, products) => {
  const productCollection = collection(db, "products", campaignId, "campaignProducts");
  
  const addProductPromises = products.map(product => addDoc(productCollection, product));

  await Promise.all(addProductPromises);
};

export const contactUsForm = async (userId, contactData) => {
  try {
    const contactRef = doc(db, "contactUs", userId); 
    await setDoc(contactRef, contactData);
    console.log("Contact form submitted successfully!");    
  } catch (error) {
    console.error("Error saving contact form:", error);
    throw error;
  }
};

export const getBusinessByCampaignId = async (campaignId) => {
  try {
    let business = null;
    const allCampaigns = await getAllCampaigns();
    const matchedCampaign = allCampaigns.find(campaign => campaign.id === campaignId);

    if (matchedCampaign) {
      business = { businessId: matchedCampaign.userId, ...matchedCampaign };
    }

    return business.id;
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
};

export const generateAffiliateLink = async (userId, campaignId, productId = null, productUrl = "") => {
  try {

    let commissionRate = 0;
    if (productId) {
    const product = await getProduct(productId, campaignId);
      if (product) {
        productUrl = product.productUrl;
      }
    }

    const businessCampaignId = await getCampaignById(campaignId);
    const businessId = businessCampaignId.userId;
    if (businessCampaignId) {
      commissionRate = businessCampaignId.commissionRate || 0;
    }

    const utmParams = new URLSearchParams({
      utm_source: "affiliate",
      utm_medium: "referral",
      utm_campaign: campaignId,
      utm_product: productId,
      utm_content: userId,
      utm_commission_rate: commissionRate,
      utm_affiliate_network:"AddictiveAffiliates",
    });

    const finalProductUrl = productUrl ? `${productUrl}?${utmParams.toString()}` : null;
    

    const linkData = {
      affiliateId: userId,
      businessId: businessId,
      campaignId,
      productId,
      productUrl: finalProductUrl,
      createdAt: new Date(),
      clicks: 0,
      conversions: 0,
      revenue: 0,
      isActive: true
    };

    const linkRef = collection(db, "affiliateLinks");
    const docRef = await addDoc(linkRef, linkData);
    
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/track?linkId=${docRef.id}`;
    
    return {
      linkId: docRef.id,
      link,
      ...linkData
    };
  } catch (error) {
    console.error("Error generating affiliate link:", error);
    throw error;
  }
};

export const getAffiliateLink = async (linkId) => {
  try {
    const linkRef = doc(db, "affiliateLinks", linkId);
    const linkSnap = await getDoc(linkRef);
    
    if (!linkSnap.exists()) {
      throw new Error("Affiliate link not found");
    }
    
    return { id: linkSnap.id, ...linkSnap.data() };
  } catch (error) {
    console.error("Error fetching affiliate link:", error);
    throw error;
  }
};

export const getAffiliateLinkByAffiliate = async (affiliateId, productId) => {
  try {
    const linksRef = collection(db, "affiliateLinks");
    const querySnapshot = await getDocs(
      query(linksRef, where("affiliateId", "==", affiliateId), where("productId", "==", productId))
    );

    return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error("Error fetching affiliate link:", error);
    throw error;
  }
};


export const updateAffiliateLinkStats = async (linkId, updateData) => {
  try {
    const linkRef = doc(db, "affiliateLinks", linkId);
    await updateDoc(linkRef, updateData);
  } catch (error) {
    console.error("Error updating affiliate link stats:", error);
    throw error;
  }
};

export const getUserAffiliateLinks = async (userId) => {
  try {
    const linksRef = collection(db, "affiliateLinks");
    const q = query(linksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching user affiliate links:", error);
    throw error;
  }
};

const getCampaignName = async (campaignId, userId) => {
  try {
    const campaignRef = doc(db, `campaigns/${userId}/userCampaigns/${campaignId}`);
    const campaignSnap = await getDoc(campaignRef);

    if (!campaignSnap.exists()) {
      console.warn(`Campaign not found: ${campaignId} for user ${userId}`);
      return "Unknown Campaign";
    }
    const campaignData = campaignSnap.data();

    return campaignData.campaignName || "Unknown Campaign";
  } catch (error) {
    console.error("Error fetching campaign name:", error);
    return "Unknown Campaign";
  }
};


export const getAffiliateStats = async (userId) => {
  try {
    const linksRef = collection(db, "affiliateLinks");
    const transactionsRef = collection(db, "transactions");

    const affiliateQuery = query(linksRef, where("affiliateId", "==", userId));
    const earningsQuery = query(transactionsRef, where("userId", "==", userId));

    const [affiliateSnapshot, earningsSnapshot] = await Promise.all([
      getDocs(affiliateQuery),
      getDocs(earningsQuery),
    ]);

    const stats = {
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      totalEarnings: 0, 
      activeLinks: 0,
      earningsByDate: {}, 
      topCampaigns: [],
    };

    const campaignStats = {};
    const campaignFetchPromises = [];

    affiliateSnapshot.forEach((doc) => {
      const data = doc.data();
      stats.totalClicks += data.clicks || 0;
      stats.totalConversions += data.conversions || 0;
      stats.totalRevenue += data.revenue || 0;
      if (data.isActive) stats.activeLinks++;

      if (data.campaignId) {
        if (!campaignStats[data.campaignId]) {
          campaignStats[data.campaignId] = {
            clicks: 0,
            conversions: 0,
            revenue: 0,
            campaignName: "",
          };
        }
        campaignStats[data.campaignId].clicks += data.clicks || 0;
        campaignStats[data.campaignId].conversions += data.conversions || 0;
        campaignStats[data.campaignId].revenue += data.revenue || 0;

        campaignFetchPromises.push(
          getCampaignName(data.campaignId, userId).then((name) => {
            campaignStats[data.campaignId].campaignName = name;
          })
        );
      }
    });

    earningsSnapshot.forEach((doc) => {
      const { amount, date } = doc.data();
      stats.totalEarnings += amount || 0;

      const dateKey = new Date(date).toISOString().split("T")[0]; 
      if (!stats.earningsByDate[dateKey]) {
        stats.earningsByDate[dateKey] = 0;
      }
      stats.earningsByDate[dateKey] += amount;
    });

    await Promise.all(campaignFetchPromises);

    stats.topCampaigns = Object.entries(campaignStats)
      .map(([id, data]) => ({
        id,
        ...data,
        conversionRate: data.clicks > 0 ? ((data.conversions / data.clicks) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return stats;
  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    throw error;
  }
};

export const fetchBalance = async (userId) => {
  try {
    const accountRef = doc(db, "accounts", userId);
    const accountSnap = await getDoc(accountRef);
    return accountSnap.exists() ? accountSnap.data() : 0;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
};

export const fetchTransactions = async (userId) => {
  try {
    const q = query(collection(db, "transactions"), where("affiliateId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const submitWithdrawalRequest = async (transactionId, userEmail) => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);

    await updateDoc(transactionRef, {
      status: "requested",
      requestedAt: new Date(),
      email: userEmail,
    });

    return true;
  } catch (error) {
    console.error("Error updating withdrawal request:", error);
    return false;
  }
};

export const recordConversion = async (campaignId, affiliateId, productId, orderValue, commissionRate) => {
  try {
    const linkQuery = query(
      collection(db, "affiliateLinks"),
      where("campaignId", "==", campaignId),
      where("affiliateId", "==", affiliateId),
      where("productId", "==", productId),
    );


    const linkSnap = await getDocs(linkQuery);

    if (linkSnap.empty) {
      throw new Error("Affiliate link not found");
    }

    const linkDoc = linkSnap.docs[0];
    const linkId = linkDoc.id;
    const linkData = linkDoc.data();

    const earnedCommission = orderValue * commissionRate;

    const businessCampaignId = await getCampaignById(linkData.campaignId);
    const businessId = businessCampaignId.userId;

    await updateDoc(doc(db, "affiliateLinks", linkId), {
      conversions: increment(1),
      revenue: increment(orderValue),
      conversionDates: arrayUnion(new Date()),
    });

    await editProduct(campaignId, productId, {
      conversions: increment(1),
      revenue: increment(orderValue),
    });

    await editCampaign(businessId, campaignId, {
      conversions: increment(1),
      revenue: increment(orderValue),
    });    

    const accountRef = doc(db, "accounts", affiliateId);
    const accountSnap = await getDoc(accountRef);

    if (!accountSnap.exists()) {
      await setDoc(accountRef, {
        userId: affiliateId,
        currentBalance: 0,
        lifetimeEarnings: 0,
      });
    } else {
      await updateDoc(accountRef, {
        currentBalance: increment(0)
      });
    }
    
    const transactionRef = collection(db, "transactions");
    const transactionDoc = await addDoc(transactionRef, {
      affiliateId,
      businessId: businessId,
      email: linkData.email || '', 
      amount: earnedCommission,
      date: new Date(),
      productId: linkData.productId,
      campaignId: linkData.campaignId,
      status: "pending",
    });

    return transactionDoc.id;
  } catch (error) {
    console.error("Error recording conversion:", error);
    throw error;
  }
};

export const approveTransaction = async (transactionId, affiliateId, businessId, amount) => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);
    const affiliateRef = doc(db, "accounts", affiliateId);
    const businessRef = doc(db, "accounts", businessId);

    const affiliateSnapshot = await getDoc(affiliateRef);
    if (!affiliateSnapshot.exists()) {
      throw new Error("Affiliate account not found!");
    }

    const businessSnapshot = await getDoc(businessRef);
    if (!businessSnapshot.exists()) {
      throw new Error("Business account not found!");
    }

    await updateDoc(transactionRef, {
      status: "completed",
    });

    if (!affiliateSnapshot.exists()) {
      await setDoc(affiliateRef, {
        userId: affiliateId,
        currentBalance: amount,
        lifetimeEarnings: amount,
      });
    } else {
      await updateDoc(affiliateRef, {
        currentBalance: increment(amount),
        lifetimeEarnings: increment(amount),
      });
    }

    if (businessSnapshot.data().currentBalance < amount) {
      throw new Error("Insufficient funds. Please deposit more money.");
    }

    await updateDoc(businessRef, {
      currentBalance: increment(-amount),
    });

    return true;
  } catch (error) {
    console.error("Error approving transaction:", error);
    return false;
  }
};

export const getEarningsByDate = async (userId) => {
  const querySnapshot = await getDocs(collection(db, "affiliateLinks"));
  const earningsMap = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.affiliateId === userId && data.conversionDates?.length > 0) {
      data.conversionDates.forEach((date) => {
        const formattedDate = format(date.toDate(), "yyyy-MM-dd"); 

        if (!earningsMap[formattedDate]) {
          
          earningsMap[formattedDate] = { date: formattedDate, revenue: 0 };
        }

        earningsMap[formattedDate].revenue += (data.revenue || 0) / data.conversionDates.length; 
      });
    }
  });

  return Object.values(earningsMap);
};

export const fetchRequests = async (businessId) => {
  try {
    const q = query(collection(db, "transactions"), where("businessId", "==", businessId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
};

export const updateBusinessDeposit = async (userId, amount) => {
  try {
    const businessRef = doc(db, "accounts", userId);
    const businessSnapshot = await getDoc(businessRef);
    const stripeAccountRef = doc(db, "stripeAccounts", userId);
    const stripeAccountSnapshot = await getDoc(stripeAccountRef);

    if (!businessSnapshot.exists()) {
      await setDoc(businessRef, {
        currentBalance: amount, 
        lifetimeEarnings: amount, 
        createdAt: new Date(),
        userId: userId,
      });
    } else {
      await updateDoc(businessRef, {
        currentBalance: increment(amount),
        lifetimeEarnings: increment(amount), 
      });
    }

    if (!stripeAccountSnapshot.exists()) {
      await setDoc(stripeAccountRef, {
        deposits: [{ amount, date: new Date().toISOString() }],
        createdAt: new Date(),
      });
    } else {
      await updateDoc(stripeAccountRef, {
        deposits: arrayUnion({
          amount,
          date: new Date().toISOString(),
        }),
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating business deposit:", error);
    return false;
  }
};

export const getStripeAccount = async (userId) => {
  const userRef = doc(db, "stripeAccounts", userId);
  const userSnapshot = await getDoc(userRef);
  return userSnapshot.exists() ? userSnapshot.data().stripeAccountId : null;
};

export const saveStripeAccount = async (userId, stripeAccountId) => {
  const userRef = doc(db, "stripeAccounts", userId);
  await setDoc(userRef, { stripeAccountId });
};

export const saveUserPreferences = async (userId, preferences) => {
  if (!userId) throw new Error("User ID is required");

  try {
    await setDoc(doc(db, "preferences", userId), {
      preferences,
      updatedAt: Timestamp.now(),
      userId: userId,
    },
    { merge: true });

    console.log("Preferences saved successfully!");
    return true;
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};

export const getUserPreferences = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  try {
    const preferenceSnap = await getDoc(doc(db, "preferences", userId));
    return preferenceSnap.exists() ? preferenceSnap.data().preferences : null;
  } catch (error) {
    console.error("Error getting preferences:", error);
    throw error;
  }
};

export const withdrawFunds = async (userId, amount) => {
  if (!userId) throw new Error("User ID is required");

  try {
    const accountRef = doc(db, "accounts", userId);
    const accountSnap = await getDoc(accountRef);

    if (!accountSnap.exists()) {
      throw new Error("Account not found");
    }

    const accountData = accountSnap.data();
    const currentBalance = accountData.currentBalance || 0;

    if (currentBalance < amount) {
      throw new Error("Insufficient balance");
    }
    return { success: true, newBalance: currentBalance - amount };
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    return { success: false, error: error.message };
  }
};

export const saveSocialLink = async (userId, platform, link) => {
  try {
      if (!userId) throw new Error("User not logged in");

      const socialRef = doc(db, "socialMedia", userId);
      await setDoc(socialRef, { [platform]: link, userId }, { merge: true });

      alert(`${platform} link saved successfully!`);
      return {success: true}
  } catch (error) {
      console.error("Error saving social link:", error);
      alert("Failed to save social link. Please try again.");
  }
};
