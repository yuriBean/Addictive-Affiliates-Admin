"use client";
import { Suspense} from "react";
import EditProduct from "@/app/components/EditProduct";

export default function EditProductPage() {

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditProduct />
    </Suspense>
  );
}
