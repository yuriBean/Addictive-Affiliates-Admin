"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getProduct, generateAffiliateLink, getUser, getAffiliateLink, getAffiliateLinkByAffiliate } from "@/app/firebase/firestoreService";

export default function ProductPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");
    const campaignId = searchParams.get("campaignId");
    const [affiliateLink, setAffiliateLink] = useState(null);
    const [generatingLink, setGeneratingLink] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!user || !campaignId || !productId) return;
    
        const fetchProduct = async () => {
          try {
            setLoading(true);
            const product = await getProduct(productId, campaignId);
            setProduct(product); 
          } catch (err) {
            setError("Failed to fetch product.");
            console.error(err);
          } finally {
            setLoading(false);
          }
        };

        const fetchUser = async () => {
          try{
            setLoading(true);
            const fetchedUser = await getUser(user.uid);
            if (fetchedUser.role === "business"){
              setUserRole("business")
            } else {
              setUserRole("affiliate")
            }
          } catch (err) {
            throw err;
          } finally {
            setLoading(false);
          }
        }

        const fetchAffiliateLink = async () => {
          try {
            const affiliateLinkData = await getAffiliateLinkByAffiliate(user.uid, productId);
            console.log('o');
        
            if (affiliateLinkData) {
              const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        
              const formattedLink = {
                ...affiliateLinkData,
                link: `${baseUrl}/track?linkId=${affiliateLinkData.id}`
              };
              console.log('o', formattedLink);
              setAffiliateLink(formattedLink);
            }
          } catch (error) {
            console.error("Error fetching affiliate link:", error);
          }
        };
          
        fetchUser();
        fetchProduct();
        fetchAffiliateLink();
      }, [user, campaignId, productId]); 
    
      if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
      }
    
      if (!product) {
        return <p className="text-center text-gray-500">{error || "Product not found."}</p>;
      }
    
      const handleGenerateLink = async () => {
        try {
          setGeneratingLink(true);
          const linkData = await generateAffiliateLink(user.uid, campaignId, productId);
          setAffiliateLink(linkData);
        } catch (error) {
          setError("Failed to generate affiliate link");
          console.error(error);
        } finally {
          setGeneratingLink(false);
        }
      };
      
      const handleCopyLink = () => {
        if (affiliateLink?.link) {
          navigator.clipboard.writeText(affiliateLink.link);
          alert("Affiliate link copied!");
        }
      };
        
  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-2xl md:text-3xl font-bold my-4">{product.productName}</h1>
      <div className="flex flex-col space-y-6 justify-center">
        {/* <div className="flex justify-center mb-4">
          <img src={product.images} alt={product.productName} className="w-full h-60 object-cover rounded-lg" />
        </div> */}

        {product.images && product.images.length > 0 ? (
        <div className="relative w-full max-w-xl mx-auto">
          <img
            src={product.images[currentImage]}
            alt={`Product Image ${currentImage + 1}`}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={() => setCurrentImage((prev) => (prev + 1) % product.images.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-full"
          >
            ▶
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">No images available</p>
      )}

        <div className="my-4">
          <h2 className="text-lg text-secondary">Price</h2>
          <p className="mt-3 font-bold text-lg">${product.price}</p>
        </div>

        <div className="my-4">
          <h2 className="text-lg text-secondary">Categories</h2>
          <p className="mt-3">
                {product.category}
          </p>
        </div>

        <div className="my-4">
          <h2 className="text-lg text-secondary">Description</h2>
          <p className="mt-3 text-sm md:text-lg">
            {product.description}
          </p>
        </div>

      {userRole === "affiliate" && (
        <div className="my-6">
          <h2 className="text-lg text-secondary">Affiliate Link</h2>
          <div className="flex space-x-0 space-y-2 md:space-x-6 justify-between md:flex-row flex-col">
          <p className="text-gray-600 mt-2 w-full">
              {affiliateLink ? affiliateLink.link : "Generate a link to start tracking"}
            </p>
          <div className="flex text-sm md:text-lg md:flex-row justify-start md:justify-end items-center w-full gap-4">
            <button 
            className="bg-secondary p-4 py-2 text-white rounded"
            onClick={handleGenerateLink}
            disabled={generatingLink || !!affiliateLink}
            >
              {generatingLink ? "Generating..." : "Generate Link"}
            </button>
            <button
            className=" bg-accent text-secondary p-4 py-2 rounded"
            onClick={handleCopyLink}
              >
              Copy Link
            </button>
          </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
