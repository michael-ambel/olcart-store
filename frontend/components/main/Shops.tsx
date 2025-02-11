import Image from "next/image";
import { FC } from "react";

const Shops: FC = () => {
  return (
    <div className="w-full px-[40px] h-auto my-[80px] flex">
      <div className="flex flex-col w-full h-auto">
        {/* Title with fade-in animation */}
        <h2 className="text-[24px] font-bold mb-[30px] animate-fade-in-up">
          Shops...
        </h2>

        {/* First Shop Container */}
        <div
          className="flex relative h-[300px] bg-shopp rounded-[12px] mb-[50px] 
          transition-all duration-300 group"
        >
          {/* Headset Image - Rotates on hover */}
          <div
            className="absolute left-10 bottom-[20px] w-[357px] 
            transition-transform duration-500 group-hover:rotate-6"
          >
            <Image
              src="/products/headset2.png"
              alt=""
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>

          {/* JBL Image - Moves up on hover */}
          <div
            className="absolute left-[36%] bottom-4 w-[367px] 
            transition-transform duration-500 group-hover:-translate-y-4"
          >
            <Image
              src="/products/jbl.png"
              alt=""
              width={500}
              height={500}
              className="w-full h-auto"
            />
          </div>

          {/* Headset 3 Image - Scales up on hover */}
          <div
            className="absolute bottom-0 right-0 w-[279px] 
            transition-transform duration-500 group-hover:scale-110"
          >
            <Image
              src="/products/headset3.png"
              alt=""
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>

          {/* Shop Title - Slides in from left on hover */}
          <h2
            className="absolute text-[20px] font-semibold ml-[22px] mt-[86px] 
            transition-transform duration-500 group-hover:translate-x-4"
          >
            Pixel Paradise
          </h2>
        </div>

        {/* Second Row */}
        <div className="flex w-full h-[300px] gap-[50px]">
          <div
            className="flex relative h-[300px] w-1/2 bg-shops rounded-[12px] 
  transition-all duration-300 group"
          >
            {/* Bag Image - Bounces on hover */}
            <div
              className="absolute left-10 bottom-6 w-[175px] 
    transition-transform duration-500 group-hover:animate-bounce"
            >
              <Image
                src="/products/bag.png"
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            {/* Fashion Women Image - Zooms out from the top edge */}
            <div
              className="absolute left-[42%] top-0 w-[139px] 
    transition-transform duration-500 group-hover:scale-110 origin-top"
            >
              <Image
                src="/products/fashonw.png"
                alt=""
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>

            {/* Fashion Men Image - Zooms out from the top edge */}
            <div
              className="absolute top-0 right-6 w-[145px] 
    transition-transform duration-500 group-hover:scale-110 origin-top"
            >
              <Image
                src="/products/fashonm.png"
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            {/* Shop Title - Slides in from right on hover */}
            <h2
              className="absolute text-[20px] font-semibold ml-[22px] mt-[86px] 
    transition-transform duration-500 group-hover:-translate-x-4"
            >
              The Curious Crate
            </h2>
          </div>

          {/* Right Shop */}
          <div
            className="relative h-[300px] w-1/2 bg-shopt rounded-[12px] 
            transition-all duration-300 group"
          >
            {/* Smartwatch Image - Scales down on hover */}
            <div
              className="absolute left-10 bottom-6 w-[175px] 
              transition-transform duration-500 group-hover:scale-90"
            >
              <Image
                src="/products/smartwatch.png"
                alt=""
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>

            {/* Minifan Image - Moves left on hover */}
            <div
              className="absolute right-10 bottom-0 w-[256px] 
              transition-transform duration-500 group-hover:-translate-x-4"
            >
              <Image
                src="/products/minifan.png"
                alt=""
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>

            {/* Shop Title - Slides up on hover */}
            <h2
              className="absolute text-[20px] font-semibold ml-[22px] mt-[36px] 
              transition-transform duration-500 group-hover:-translate-y-4"
            >
              Zenith Zone
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shops;
