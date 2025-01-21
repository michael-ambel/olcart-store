import Image from "next/image";
import { FC } from "react";

const Shops: FC = () => {
  return (
    <div className="w-full px-[40px] h-auto my-[80px] flex  ">
      <div className="flex flex-col w-full h-auto">
        <h2 className="text-[24px] font-bold mb-[30px]">Shops...</h2>
        <div className="flex relative h-[300px] bg-shopp rounded-[12px] mb-[50px]">
          <Image
            src="/products/headset2.png"
            alt=""
            width={300}
            height={300}
            className="absolute left-10 bottom-[20px] w-[357px]"
          />
          <Image
            src="/products/jbl.png"
            alt=""
            width={500}
            height={500}
            className="absolute left-[36%] bottom-4 w-[367px]"
          />
          <Image
            src="/products/headset3.png"
            alt=""
            width={300}
            height={300}
            className="absolute bottom-0 right-0 w-[279px]"
          />
          <h2 className="absolute text-[20px] font-semibold ml-[22px] mt-[86px]">
            Pixel Paradise
          </h2>
        </div>
        <div className="flex w-full h-[300px] gap-[50px] ">
          <div className="flex relative h-[300px] w-1/2 bg-shops rounded-[12px]">
            <Image
              src="/products/bag.png"
              alt=""
              width={300}
              height={300}
              className="absolute left-10 bottom-6 w-[175px]"
            />
            <Image
              src="/products/fashonw.png"
              alt=""
              width={500}
              height={500}
              className="absolute left-[42%] top-0 w-[139px]"
            />
            <Image
              src="/products/fashonm.png"
              alt=""
              width={300}
              height={300}
              className="absolute top-0 right-6 w-[145px]"
            />
            <h2 className="absolute text-[20px] font-semibold ml-[22px] mt-[86px]">
              The Curious Crate
            </h2>
          </div>
          <div className="relative h-[300px] w-1/2 bg-shopt rounded-[12px]">
            <Image
              src="/products/smartwatch.png"
              alt=""
              width={300}
              height={300}
              className="absolute left-10 bottom-6 w-[175px]"
            />
            <Image
              src="/products/minifan.png"
              alt=""
              width={500}
              height={500}
              className="absolute right-10 bottom-0 w-[256px]"
            />
            <h2 className="absolute text-[20px] font-semibold ml-[22px] mt-[36px]">
              Zenith Zone
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shops;
