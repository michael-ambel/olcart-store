import Image from "next/image";
import { FC } from "react";

const CategoryBar: FC = () => {
  const categories: string[] = [
    "Electronics",
    "Fashion",
    "Health & Beauty",
    "Sports",
    "Home & Garden",
    "Jewelry",
  ];
  return (
    <div className="flex justify-between items-end mx-[84px] my-[40px] gap-6">
      <button className="flex items-center justify-between font-bold w-[200px] h-[46px] px-[16px]  bg-fades rounded-[4px]">
        <Image
          src="./icons/menu.svg"
          alt=""
          width={500}
          height={500}
          className="w-[20px]"
        />
        All Category
        <Image
          src="./icons/arrow.svg"
          alt=""
          width={500}
          height={500}
          className="w-[20px]"
        />
      </button>

      {categories.map((c, i) => (
        <div key={i}>
          <button className="flex items-center text-mb justify-between w-auto h-[36px] px-[16px] bg-fades rounded-[4px]">
            {c}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryBar;
