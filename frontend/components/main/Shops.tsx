import Image from "next/image";
import { FC } from "react";

const Shops: FC = () => {
  return (
    <div className="w-full px-[20px] md:px-[40px] h-auto my-[40px] md:my-[80px] flex">
      <div className="flex flex-col w-full h-auto">
        {/* Title */}
        <h2 className="text-[20px] md:text-[24px] font-bold mb-[20px] md:mb-[30px] animate-fade-in-up">
          Shops...
        </h2>

        {/* First Shop Container - Added shadow classes */}
        <div className="flex relative h-[200px] md:h-[300px] bg-shopp rounded-[12px] mb-[30px] md:mb-[50px] transition-all duration-300 group shadow-lg ">
          <div className="absolute left-[4%] bottom-[10px] md:bottom-[20px] w-[200px] md:w-[357px] transition-transform duration-500 group-hover:rotate-6">
            <Image
              src="/products/headset2.png"
              alt=""
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute left-[36%] bottom-2 md:bottom-4 w-[200px] md:w-[367px] transition-transform duration-500 group-hover:-translate-y-4">
            <Image
              src="/products/jbl.png"
              alt=""
              width={500}
              height={500}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute bottom-0 right-0 w-[150px] md:w-[279px] transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/products/headset3.png"
              alt=""
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>

          <h2 className="absolute text-[16px] md:text-[20px] font-semibold ml-[10px] md:ml-[22px] mt-[40px] md:mt-[86px] transition-transform duration-500 group-hover:translate-x-4">
            Pixel Paradise
          </h2>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[300px] gap-[20px] md:gap-[50px]">
          {/* Left Shop - Added shadow classes */}
          <div className="flex relative h-[200px] md:h-[300px] w-full md:w-1/2 bg-shops rounded-[12px] transition-all duration-300 group shadow-lg ">
            <div className="absolute left-4 md:left-10 bottom-4 md:bottom-6 w-[100px] md:w-[175px] transition-transform duration-500 group-hover:scale-110">
              <Image
                src="/products/bag.png"
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            <div className="absolute left-[36%] md:left-[40%] top-0 bottom-0  w-[80px] md:w-[139px]  transition-transform duration-500 group-hover:translate-x-4 origin-top">
              <Image
                src="/products/fashonw.png"
                alt=""
                width={500}
                height={500}
                className="w-full h-full"
              />
            </div>

            <div className="absolute top-0  right-4 md:right-6 w-[80px] md:w-[145px] transition-transform duration-500 group-hover:scale-110 origin-top">
              <Image
                src="/products/fashonm.png"
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            <h2 className="absolute text-[16px] md:text-[20px] font-semibold ml-[10px] md:ml-[22px] mt-[40px] md:mt-[86px] transition-transform duration-500 group-hover:-translate-x-4">
              The Curious Crate
            </h2>
          </div>

          {/* Right Shop - Added shadow classes */}
          <div className="relative h-[200px] md:h-[300px] w-full md:w-1/2 bg-shopt rounded-[12px] transition-all duration-300 group shadow-lg">
            <div className="absolute left-4 md:left-10 bottom-4 md:bottom-6 w-[100px] md:w-[175px] transition-transform duration-500 group-hover:scale-90">
              <Image
                src="/products/smartwatch.png"
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            <div className="absolute right-4 md:right-10 bottom-0 w-[150px] md:w-[256px] transition-transform duration-500 group-hover:-translate-x-4">
              <Image
                src="/products/minifan.png"
                alt=""
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>

            <h2 className="absolute text-[16px] md:text-[20px] font-semibold ml-[10px] md:ml-[22px] mt-[20px] md:mt-[36px] transition-transform duration-500 group-hover:-translate-y-4">
              Zenith Zone
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shops;
