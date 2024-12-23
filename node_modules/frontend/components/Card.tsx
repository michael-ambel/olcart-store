import Image from "next/image";
import { FC } from "react";

const Card: FC = () => {
  const s: number = 4.5;
  const tstar: number[] = [1, 2, 3, 4, 5];
  return (
    <div className="flex flex-col w-[190px] h-auto text-[12px]">
      <div className="flex items-center justify-center w-[190px] h-[190px]  bg-fades rounded-[12px]">
        <Image
          src={`/products/shoe.png`}
          alt=""
          width={500}
          height={500}
          layout="intrinsic"
          className=" w-[160px] "
        />
      </div>
      <p className="my-[6px]">
        Advanced All-In-One Virtual Reality Headset — 256 GB
      </p>
      <div className="flex justify-between ">
        <div className="flex justify-between w-[100px]">
          {tstar.map((ts, i) => {
            const src: string =
              s >= ts
                ? "/icons/fstar.svg"
                : ts - 1 < s && s < ts
                ? "/icons/hstar.svg"
                : "/icons/zstar.svg";

            return (
              <div key={i} className="w-[15px]">
                <Image
                  src={src}
                  alt=""
                  width={500}
                  height={500}
                  layout="intrinsic"
                  className=" w-[15px] "
                />
              </div>
            );
          })}
        </div>

        <p>256 sold</p>
      </div>
      <div className="flex justify-between my-[4px]">
        <p className="text-[10px] font-semibold">
          US<span className="text-[16px] font-semibold">$38</span>
        </p>
        <p className="text-mb">free shipping</p>
      </div>
    </div>
  );
};

export default Card;
