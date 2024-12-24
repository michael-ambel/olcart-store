import { FC } from "react";
import Card from "./Card";

const YourFeed: FC = () => {
  const products: string[] = [
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
  ];
  return (
    <div className="flex w-full px-[84px] my-[40px]">
      <div className="flex flex-col px-[22px] pt-[40px] w-full bg-bgs rounded-[20px]">
        <h2 className="text-[24px] font-bold">Your Feed...</h2>
        <div className="grid grid-cols-5 gap-[36px] w-full  my-[30px]">
          {products.map((_, i) => (
            <Card key={i} />
          ))}
          <div className="flex items-end pb-[60px] text-[20px] font-semibold">
            see more...
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourFeed;
