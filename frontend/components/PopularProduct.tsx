import Image from "next/image";
import { FC } from "react";

const PopularProduct: FC = () => {
  const products: string[] = ["earbud", "minifan", "shoe", "mouse", "usb"];
  return (
    <div className="flex flex-col justify-between w-full h-[250px] px-[84px] my-[40px]">
      <h2 className="text-[24px] font-bold">Popular Products</h2>
      <div className="flex w-full justify-between ">
        {products.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-center w-[180px] h-[180px] rounded-full bg-fades"
          >
            <Image
              src={`/products/${p}.png`}
              alt=""
              width={500}
              height={500}
              layout="intrinsic"
              className=" w-[160px] "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProduct;
