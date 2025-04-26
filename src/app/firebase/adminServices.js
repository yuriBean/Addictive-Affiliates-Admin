import { db } from "./config";  
import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";  

export const getTotalRevenue = async () => {
  const transactionsRef = collection(db, "transactions");
  const querySnapshot = await getDocs(transactionsRef);
  let totalRevenue = 0;

  querySnapshot.forEach((doc) => {
    totalRevenue += doc.data().amount || 0;
  });

  return totalRevenue;
};

export const getTotalConversions = async () => {
  const linksRef = collection(db, "affiliateLinks");
  const querySnapshot = await getDocs(linksRef);
  let totalConversions = 0;

  querySnapshot.forEach((doc) => {
    totalConversions += doc.data().conversions || 0;
  });

  return totalConversions;
};

export const getTotalClicks = async () => {
  const linksRef = collection(db, "affiliateLinks");
  const querySnapshot = await getDocs(linksRef);
  let totalClicks = 0;

  querySnapshot.forEach((doc) => {
    totalClicks += doc.data().clicks || 0;
  });

  return totalClicks;
};

export const getTotalAffiliates = async () => {
  const accountsRef = collection(db, "users");
  const q = query(accountsRef, where("role", "==", "affiliate"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.size;
};

export const getTotalBusinesses = async () => {
  const accountsRef = collection(db, "users");
  const q = query(accountsRef, where("role", "==", "business"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.size;
};

export const getPendingPayouts = async () => {
  const paymentsRef = collection(db, "transactions");
  const q = query(paymentsRef, where("status", "==", "pending"));
  const querySnapshot = await getDocs(q);
  let totalPending = 0;

  querySnapshot.forEach((doc) => {
    totalPending += doc.data().amountRequested || 0;
  });

  return totalPending;
};

export const getTopCampaigns = async () => {
  try {
    const campaignsSnapshot = await getDocs(collectionGroup(db, "userCampaigns"));
    
    const campaigns = campaignsSnapshot.docs.map(doc => {
      const data = doc.data();
      const conversions = data.conversions || 0;
      const clicks = data.clicks || 1; 
      const conversionRate = ((conversions / clicks) * 100).toFixed(2);
      
      return {
        id: doc.id,
        ...data,
        conversionRate: `${conversionRate}%`
      };
    });

    const sortedCampaigns = campaigns.sort((a, b) => (b.conversions || 0) - (a.conversions || 0));
    
    return sortedCampaigns.slice(0, 5);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const getTopProducts = async () => {
  try {
    const productsSnapshot = await getDocs(collectionGroup(db, "campaignProducts"));
    
    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      const conversions = data.conversions || 0;
      const clicks = data.clicks || 1; 
      const conversionRate = ((conversions / clicks) * 100).toFixed(2);
      
      return {
        id: doc.id,
        ...data,
        conversionRate: `${conversionRate}%`
      };
    });

    const sortedProducts = products.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    
    return sortedProducts.slice(0, 5);
  } catch (error) {
    console.error("Error fetching products:", error);
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

export const updateCampaignStatus = async (userId, campaignId, isActive = null, status) => {
  try {
    const campaignRef = doc(db, "campaigns", userId, "userCampaigns", campaignId);
    const campaignSnap = await getDoc(campaignRef);

    if (!campaignSnap.exists()) {
      console.error("Campaign not found.");
      return;
    }

    const campaignData = campaignSnap.data();
    let updateData = {};

    if (status !== null) {
      updateData.status = status;

      if (status === "pending_approval") {
        updateData.isActive = false; 
      }
    }

    if (isActive !== null && campaignData.status !== "pending_approval") {
      updateData.isActive = isActive;
    }

    await updateDoc(campaignRef, updateData, { merge: true });
    console.log("Campaign updated successfully!", updateData);
  } catch (error) {
    console.error("Error updating campaign status:", error);
  }
};

export const getUsersByRole = async (role) => {
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

    const filteredUsers = users.filter((user) => user.role === role);
    return filteredUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
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

export const updateProductStatus = async (productId, campaignId, isActive = null, isDisapproved = null) => {
  try {
    const productRef = doc(db, "products", campaignId, "campaignProducts", productId);
    const productSnap = await getDoc(productRef);
    console.log(productId, campaignId)

    if (!productSnap.exists()) {
      console.error("Product not found.");
      return;
    }

    const productData = productSnap.data();
    let updateData = {};

    if (isDisapproved !== null) {
      updateData.isDisapproved = isDisapproved;

      if (isDisapproved) {
        updateData.isActive = false; 
      }
    }

    if (isActive !== null && !productData.isDisapproved) {
      updateData.isActive = isActive;
    }

    await updateDoc(productRef, updateData, { merge: true });
    console.log("Product updated successfully!", updateData);
  } catch (error) {
    console.error("Error updating product status:", error);
  }
};

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

export const getUserCampaignsAndProducts = async (userId) => {
  try {
    const campaignsRef = collection(db, "campaigns", userId, "userCampaigns");
    const campaignsSnap = await getDocs(campaignsRef);
    const totalCampaigns = campaignsSnap.size;

    let totalProducts = 0;
    for (const campaignDoc of campaignsSnap.docs) {
      const campaignId = campaignDoc.id;
      const productsRef = collection(db, "products", campaignId, "campaignProducts");
      const productsSnap = await getDocs(productsRef);
      totalProducts += productsSnap.size; 
    }

    return { totalCampaigns, totalProducts };
  } catch (error) {
    console.error("Error fetching campaign and product counts:", error);
    return { totalCampaigns: 0, totalProducts: 0 };
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const disableUser = async (userId, isDisabled) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {isDisabled: isDisabled}, {merge: true});
    console.log("User updated");
  } catch (error) {
    console.error("Failed to update Firestore user status:", error);
  }
};
