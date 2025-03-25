"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { getAllProducts } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";

export default function AffiliateProducts() { 
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productsPerPage = 9;

  useEffect(() => {
    if (!user) return;
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await getAllProducts();
        const filteredProducts = productList.filter((product) => product.isActive)
        setProducts(filteredProducts);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) return <p className="text-black text-center">Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">VIEW ALL PRODUCTS</h1>

      <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentProducts.map((product) => ( 
              <Link href={`/dashboard/product?productId=${product.id}&campaignId=${product.assignedCampaign}`} key={product.id} className="p-4 bg-[#E3E3E3] shadow-lg rounded-lg">
                <img src={product.images} alt={product.productName} className="w-full h-40 text-sm object-cover rounded-lg" />
                <h3 className="text-md md:text-lg font-bold mt-3">
                {product.productName.length > 20 ? product.productName.slice(0, 25) + "..." : product.productName}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">Price: ${product.price || product.pricePerAction}</p>
                <small>Product Type: {product.paymentType === "ppc" ? "Pay per click" : product.paymentType === "ppcv" ? "Pay per conversion" : `Pay per join (Whatsapp groups only)`}</small>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg ${currentPage === index + 1 ? "bg-secondary text-white" : "bg-gray-200"}`} 
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="p-2 rounded-lg disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
