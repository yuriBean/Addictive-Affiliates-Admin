"use client"
import Link from "next/link";

export default function TopProductsTable({ products }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Top Products</h2>
      <div className="my-6 text-left md:text-right">
        <Link href="/dashboard/add-product" className="bg-secondary text-white p-3 md:p-4 text-sm md:text-md rounded-lg font-bold">
          Add Product
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg border border-1 border-gray-300 shadow-lg overflow-x-auto">
        <table className="md:min-w-full table-auto">
          <thead>
            <tr className="text-left border-b border-1 border-gray-200">
              <th className="p-5 border-b">Product Name</th>
              <th className="p-5 border-b">Revenue</th>
              <th className="p-5 border-b">Conversions</th>
              <th className="p-5 border-b">Clicks</th>
              <th className="p-5 border-b">CR</th>
            </tr>
          </thead>
          <tbody className="text-gray-500">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-5 border-b text-black">{product.productName}</td>
                <td className="p-2 border-b text-black">
                  <span className="bg-[#E8EDF2] rounded-md p-2 px-4 font-semibold">
                    ${product?.revenue?.toFixed(2) || "0.00"}
                  </span>
                </td>
                <td className="p-5 border-b">{product.conversions || 0}</td>
                <td className="p-5 border-b">{product.clicks || 0}</td>
                <td className="p-5 border-b">{product.conversionRate || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
