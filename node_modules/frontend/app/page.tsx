import CategoryBar from "@/components/CategoryBar";

import MainCard from "@/components/MainEventCard";
import PopularProduct from "@/components/PopularProduct";
import Shops from "@/components/Shops";
import YourFeed from "@/components/YourFeed";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center ">
        <CategoryBar />
        <MainCard />
        <PopularProduct />
        <YourFeed />
        <Shops />
      </main>
    </div>
  );
}
