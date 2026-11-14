"use client";

import React, { memo } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/data/products";

interface NewArrivalsProps {
  products: Product[];
}

function NewArrivalsComponent({ products }: NewArrivalsProps) {
  if (products.length === 0) return null;

  return (
    <div className="stelina-product produc-featured rows-space-40">
      <div className="container">
        <h3 className="custommenu-title-blog">New Arrivals</h3>
        <ul className="row list-products auto-clear equal-container product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              asListItem={true}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export const NewArrivals = memo(NewArrivalsComponent);
