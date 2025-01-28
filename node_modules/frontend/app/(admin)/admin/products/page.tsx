"use client";

import ProductButtons from "@/components/admin/ProductButtons";
import { useGetProductsQuery } from "@/store/apiSlices/productApiSlice";
import { Product } from "@/store/types/productTypes";

export const dynamic = "force-dynamic";

export default function Products() {
  const { data, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error || !data?.products) return <div>Error loading products.</div>;

  const products: Product[] = data.products;

  return (
    <div className="flex flex-col p-[34px] mt-[130px] ml-[144px] gap-[30px] bg-bgt">
      <ProductButtons />

      <div>
        <table className="w-full border-collapse bg-fade gap-2">
          <thead>
            <tr className="text-left text-bl">
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                No
              </th>
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                Name
              </th>
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                ID
              </th>
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                Stock Qty
              </th>
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                Orders
              </th>
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                Total Sales ($)
              </th>
              <th className="px-4 py-2 bg-bg rounded-md border-bl border-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {products.map((product, index) => (
              <tr
                key={product._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } shadow-md rounded-md`}
              >
                <td className="px-4 py-[4px] rounded-md border-fade border-2">
                  {index + 1}
                </td>
                <td className="px-4 py-[4px] rounded-md border-fade border-2">
                  {product.name}
                </td>
                <td className="px-4 py-[4px] rounded-md border-fade border-2">
                  {product._id}
                </td>
                <td className="px-4 py-[4px] rounded-md border-fade border-2">
                  {product.stock}
                </td>
                <td className="px-4 py-[4px] rounded-md border-fade border-2">
                  {product.price}
                </td>
                <td className="px-4 py-[4px] rounded-md border-fade border-2">
                  {product.stock}
                </td>
                <td className="px-4 py-[4px] rounded-md border-fade border-2 text-center">
                  <a
                    href={`/admin/products/${product.stock}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <span>Edit</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
