import FilterComponent from "@/components/main/FilterComponent";
import Footer from "@/components/main/Footer";
import SearchResultsDisplay from "@/components/main/SearchResultsDisplay";

export default function Search() {
  return (
    <div className="flex flex-col w-full items-start justify-between px-[20px] mt-[120px] pl-[280px]">
      <FilterComponent />
      <SearchResultsDisplay />
      <Footer />
    </div>
  );
}
