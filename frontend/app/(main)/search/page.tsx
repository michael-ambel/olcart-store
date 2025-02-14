import FilterComponent from "@/components/main/FilterComponent";
import SearchResultsDisplay from "@/components/main/SearchResultsDisplay";

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row w-full px-4 md:px-6 lg:px-8 mt-24 md:mt-32">
      <FilterComponent />
      <SearchResultsDisplay />
    </div>
  );
}
