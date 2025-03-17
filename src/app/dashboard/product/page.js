"use client";
import Product from "@/app/components/Product"
import { Suspense } from "react";

export default function ProductPage() {
        
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Product />
    </Suspense>
  );
}
