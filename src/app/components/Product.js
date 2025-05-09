"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getProduct, getCampaignById } from "@/app/firebase/firestoreService";
import Image from "next/image";

export default function ProductPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const productId = searchParams.get("productId");
    const campaignId = searchParams.get("campaignId");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [campaign, setCampaign] = useState('');
    const [currentMedia, setCurrentMedia] = useState(0);

    useEffect(() => {
      if (!user || !campaignId || !productId) return;
    
      const fetchProductAndCampaign = async () => {
        try {
          setLoading(true);
          const [fetchedProduct, fetchedCampaign] = await Promise.all([
            getProduct(productId, campaignId),
            getCampaignById(campaignId),
          ]);
          setProduct(fetchedProduct);
          setCampaign(fetchedCampaign);
        } catch (err) {
          setError("Failed to fetch product/campaign.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchProductAndCampaign();
    }, [user, campaignId, productId]);
  
        if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
      }
    
      if (!product) {
        return <p className="text-center text-gray-500">{error || "Product not found."}</p>;
      }
        
  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-2xl md:text-3xl font-bold my-4">{product.productName}</h1>
      <div className="flex flex-col space-y-6 justify-center">
        {product.media && product.media.length > 0 ? (
        <div className="relative w-full max-w-xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentMedia * 100}%)` }}
          >
              {product.media.map((media, index) => {
                const isImage = media.type.startsWith("image");
                const isVideo = media.type.startsWith("video");

                return isImage ? (
                  <Image
                    key={index}
                    loading="lazy"
                    src={media.url}
                    width={800}
                    height={600}                  
                    alt={`Product Image ${index + 1}`}
                    className="w-full flex-shrink-0 h-64 md:h-96 object-contain rounded-lg shadow-lg"
                  />
                ) : isVideo ? (
                  <video
                    key={index}
                    src={media.url}
                    controls
                    className="w-full flex-shrink-0 h-64 md:h-96 object-contain rounded-lg shadow-lg"
                  />
                ) : null;
              })}
            </div>
          <button
              onClick={() => setCurrentMedia((prev) => (prev === 0 ? product.media.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-3 py-1 rounded-full"
          >
            ◀
          </button>
          <button
              onClick={() => setCurrentMedia((prev) => (prev + 1) % product.media.length)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white px-3 py-1 rounded-full"
          >
            ▶
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">No media available</p>
      )}

<div className="my-6">
          <h2 className="text-lg text-secondary">Downloadable Files</h2>
          {product.files && product.files.length > 0 ? (
            <ul>
              {product.files.map((file, index) => (
                <li key={index} className="my-2">
                  <a href={file.url} download className="text-blue-500 hover:underline">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No downloadable files available.</p>
          )}
        </div>

        {product.price && 
        <div className="my-4">
          <h2 className="text-lg text-secondary">Price</h2>
          <p className="mt-3 text-lg">${product.price}</p>
        </div>
        }
        <div className="my-4">
          <h2 className="text-lg text-secondary">Categories</h2>
          <p className="mt-3">
                {product.category}
          </p>
        </div>

        <div className="my-4">
          <h2 className="text-lg text-secondary">Product Type</h2>
          <p className="mt-3">
                {campaign?.paymentType === "ppc" ? "Pay per click" : campaign?.paymentType === "ppcv" ? "Pay per conversion" : `Pay per join (Whatsapp groups only)`}
          </p>
        </div>

        {campaign?.paymentType === "ppcv" ? (
        <div className="my-4">
          <h2 className="text-lg text-secondary">Commission Rate</h2>
          <p className="mt-3">
                {campaign?.commissionRate}%
          </p>
        </div>
        ) : (
          <div className="my-4">
          <h2 className="text-lg text-secondary">Pay Per Action</h2>
          <p className="mt-3">
                ${campaign?.pricePerAction}
          </p>
        </div>
        )}

        <div className="my-4">
          <h2 className="text-lg text-secondary">Description</h2>
          <p className="mt-3 text-sm md:text-lg">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
