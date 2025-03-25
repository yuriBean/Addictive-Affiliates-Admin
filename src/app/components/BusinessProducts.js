"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight, faEdit, faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { deleteProduct, getProductsByUser, updateProductStatus } from "@/app/firebase/firestoreService";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function BusinessProducts() { 
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(null);
  const productsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productList = await getProductsByUser(user.uid);
        console.log("Fetched Products:", productList); 

        setProducts(productList);
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

  const handleDelete = async (campaignId, productId) =>{
    try {
      if (typeof window !== "undefined") {
        const isConfirmed = window.confirm("Are you sure you want to delete?");

        if (isConfirmed) {
      await deleteProduct(productId, campaignId );
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    }
  }

    } catch (err) {
      console.error("Failed to delete product.", err);
    }
  }

  const toggleProductStatus = async (campaignId, productId, isActive) => {
    if (toggling) return; 
    setToggling(productId);
  
    try {
      await updateProductStatus(productId, campaignId, !isActive);
  
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, isActive: !isActive } : product
        )
      );
  
    } catch (err) {
      console.error("Failed to update product status", err);
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="text-black mx-auto max-w-screen">
      <h1 className="text-headings text-2xl md:text-3xl font-bold my-4">MANAGE YOUR PRODUCTS</h1>
      <div className="my-6 text-left md:text-right">
        <Link href="/dashboard/add-product" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">Add Product</Link>
      </div>
      <div className="flex flex-col space-y-6 justify-center">
        <div className="my-4">
        <div className="my-4 overflow-x-auto">
          <table className="min-w-full table-auto mt-4 border-separate border-spacing-3">
            <thead>
            <tr className="border-b text-sm md:text-lg">
                <th className="px-4 py-2 text-left bg-accent rounded">Name</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Active</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Price</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Campaigns</th>
                <th className="px-4 py-2 text-left bg-accent rounded">Action</th>
              </tr>
            </thead>
            <tbody>
            {currentProducts.length > 0 ? (
              <>
              {currentProducts.map((product) => (  
                <tr key={product.id} className="border-b text-sm md:text-lg">
                  <td className="px-4 py-2">
                  <Link href={`/dashboard/product?productId=${product.id}&campaignId=${product.assignedCampaign}`} title={product.productName}>
                  {product.productName.length > 20 ? product.productName.slice(0, 25) + "..." : product.productName}
                    </Link>
                    </td>
                  <td className="px-4 py-2">
                    <FontAwesomeIcon
                      icon={product.isActive ? faToggleOn : faToggleOff}
                      className={`cursor-pointer text-2xl md:text-4xl ${
                        toggling === product.id ? "opacity-50 cursor-not-allowed" : "text-secondary"
                      }`}
                      onClick={() =>
                        toggling === null && toggleProductStatus(product.assignedCampaign, product.id, product.isActive)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">${product.price || product.pricePerAction}</td>
                  <td className="px-4 py-2">{product.assignedCampaignName}</td>
                  <td className="px-4 py-2 flex justify-around items-center">
                  <Link href={`/dashboard/edit-product?productId=${product.id}&campaignId=${product.assignedCampaign}`} passHref>
                    <FontAwesomeIcon icon={faEdit} className="cursor-pointer" />
                  </Link>
                    <FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(product.assignedCampaign, product.id)} />
                  </td>
                </tr>
              ))}
            </>
            ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No products to show</td>
                </tr>
            )}
            </tbody>
          </table>
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
                className={`p-2 rounded-lg ${currentPage === index + 1}`}
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
