import Image from "next/image";
import { FC } from "react";

const MainCard: FC = () => {
  return (
    <div className="flex w-full justify-between  h-[348px] bg-mo my-[80px] px-[84px]">
      <div className="flex flex-col w-[400px] h-full text-bg">
        <h2 className="text-[24px] font-bold mt-[80px]">
          Black Friday and Cyber Monday:
        </h2>
        <p className="text-[20px] my-[20px]">
          Offer significant discounts and flash sales on a variety of products.
        </p>
        <button className="w-[150px] h-[52px] bg-bl rounded-full ">
          shop now
        </button>
      </div>
      <div className="relative w-[310px] h-full">
        <Image
          src="/maincard/watch.png"
          alt=""
          width={500}
          height={500}
          layout="intrinsic"
          className="absolute top-[-50px] w-[310px]"
        />
      </div>

      <div className="relative w-[420px] h-full">
        <Image
          src="/maincard/headset.png"
          alt=""
          width={500}
          height={500}
          layout="intrinsic"
          className="absolute top-[50px]  w-[420px]"
        />
      </div>
    </div>
  );
};

export default MainCard;
