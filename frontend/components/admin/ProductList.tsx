// components/admin/ProductList.tsx
"use client";

import { Product } from "@/store/types/productTypes";
import { useState } from "react";
import ProductEditModal from "@/components/admin/ProductEditModal";

export const ProductList = ({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  onEdit = (product) => setEditingProduct(product);
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-bl text-white">
          <tr>
            <th className="p-3 text-left">No</th>
            <th className="p-3 text-left">Product Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{product.name}</td>
              <td className="p-3">${product.price}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3">
                <button
                  onClick={() => onEdit(product)}
                  className="text-mo hover:text-mg transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};
