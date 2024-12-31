"use client";

import { FC, useEffect, useState } from "react";
import Card from "./Card";
import { useGetProductsQuery } from "@/store/apiSlices/productApiSlice";
import { Product } from "@/store/types/productTypes";

const YourFeed: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { data, isLoading, error } = useGetProductsQuery();

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  return (
    <div className="flex w-full px-[84px] my-[40px]">
      <div className="flex flex-col min-h-[200px] w-full px-[22px] pt-[40px]  bg-bgs rounded-[20px]">
        <h2 className="text-[24px] font-bold">Your Feed...</h2>
        <div className="grid grid-cols-5 gap-[36px] w-full  my-[30px]">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error loading products.</div>}
          {data && (
            <>
              {products.map((product) => (
                <Card key={product._id} product={product} />
              ))}
              <div className="flex items-end pb-[60px] text-[20px] font-semibold">
                see more...
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourFeed;
