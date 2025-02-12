"use client";

import { Product } from "@/store/types/productTypes";
import { useState } from "react";
import ProductEditModal from "@/components/admin/ProductEditModal";
import { Trash2, Edit } from "lucide-react";
import { useDeleteProductMutation } from "@/store/apiSlices/productApiSlice";
import { showToast } from "../ToastNotifications";
import { ClipLoader } from "react-spinners";

export const ProductList = ({
  products,
  refetch,
}: {
  products: Product[];
  refetch: () => void;
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct] = useDeleteProductMutation();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  ); // Track which product is being deleted

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingProductId(id); // Set the product being deleted
      try {
        await deleteProduct(id).unwrap();
        showToast("success", "Product deleted successfully!");
        refetch(); // Refresh the product list after deletion
      } catch (error) {
        showToast("error", "Failed to delete product.");
      } finally {
        setDeletingProductId(null); // Reset after deletion
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        {/* Products Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Product Id
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Sold
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Shipping
              </th>
              <th className="pr-2 py-3 bg-gray-50 text-left text-xs whitespace-nowrap text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product._id}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.salesCount ?? 0}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.averageRating
                    ? product.averageRating.toFixed(1)
                    : "No Ratings"}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.shippingPrice.toFixed(2)}
                </td>
                <td className="pr-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-mg hover:text-blue-900 transition-colors flex items-center gap-1"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                      disabled={deletingProductId === product._id} // Disable only the button for the product being deleted
                    >
                      {deletingProductId === product._id ? (
                        <ClipLoader size={18} color="#dc2626" /> // Show spinner only for the product being deleted
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};
