"use client";

import React, { useState } from "react";
import { Product, Review, TabKey } from "@/store/types/productTypes";

interface TabsSectionProps {
  product: Product;
}

const TabsSection: React.FC<TabsSectionProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const tabs: Record<TabKey, React.ReactNode> = {
    reviews: product.reviews?.length ? (
      <ul>
        {product.reviews.map((review: Review, index: number) => (
          <li key={index} className="mb-4">
            <p className="font-semibold">{review.user}</p>
            {/* Add your ratingStars logic here */}
            {review.comment && (
              <p className="text-gray-600">{review.comment}</p>
            )}
            <p className="text-sm text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No reviews yet.</p>
    ),
    description: <p>{product.description}</p>,
    specifications: (
      <ul>
        {product.specifications?.map((spec: string, index: number) => (
          <li key={index}>{spec}</li>
        ))}
      </ul>
    ),

    store: <p>{product.storeDetails || "Not available"}</p>,
    otherInfo: <p>{product.otherInfo || "Not available"}</p>,
  };

  const tabLabels: Record<TabKey, string> = {
    description: "Product Description",
    specifications: "Specifications",
    reviews: `Customer Reviews (${product.reviews?.length || 0})`,
    store: "Store Information",
    otherInfo: "Additional Information",
  };

  return (
    <div>
      <div className="flex justify-around mt-[70px]">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            className={`px-1 py-2 font-medium ${
              activeTab === tab ? "border-b-[4px] border-mo" : ""
            }`}
            onClick={() => setActiveTab(tab as TabKey)}
          >
            {tabLabels[tab as TabKey]}
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-bgt rounded-[4px] min-h-[400px]">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

export default TabsSection;
