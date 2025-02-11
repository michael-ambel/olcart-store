// app/admin/products/page.tsx
"use client";

import { useState } from "react";
import { useGetProductsQuery } from "@/store/apiSlices/productApiSlice";
import ProductCreateModal from "@/components/admin/ProductCreateModal";
import ProductEditModal from "@/components/admin/ProductEditModal";
import { ProductList } from "@/components/admin/ProductList";
import { Product } from "@/store/types/productTypes";

const ProductsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { data, isLoading, error } = useGetProductsQuery();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-mo text-white rounded-lg hover:bg-mg transition-colors"
          >
            Create Product
          </button>
        </div>
      </div>

      {isLoading && <div className="text-center py-4">Loading products...</div>}
      {error && <div className="text-red-500 py-4">Error loading products</div>}
      {data?.products && (
        <ProductList
          products={data.products}
          onEdit={(product) => setEditingProduct(product)}
        />
      )}

      {showCreateModal && (
        <ProductCreateModal
          onClose={() => setShowCreateModal(false)}
          initialData={null}
        />
      )}

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;
