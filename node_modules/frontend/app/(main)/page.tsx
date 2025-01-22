import CategoryBar from "@/components/main/CategoryBar";

import MainCard from "@/components/main/MainEventCard";
import PopularProduct from "@/components/main/PopularProduct";
import Shops from "@/components/main/Shops";
import YourFeed from "@/components/main/YourFeed";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col z-10 mt-[113px] items-center ">
        <MainCard />
        <PopularProduct />
        <YourFeed />
        <Shops />
      </main>
    </div>
  );
}
