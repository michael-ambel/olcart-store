export const CardSkeleton = () => {
  return (
    <div className="flex flex-col w-full sm:w-[190px] h-auto group relative animate-pulse">
      {/* Image Container Skeleton */}
      <div className="relative w-full sm:w-[190px] aspect-square bg-gray-200 rounded-[12px] overflow-hidden">
        <div className="absolute bottom-[6px] right-[10px] w-7 h-7 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full" />
      </div>

      {/* Product Name Skeleton */}
      <div className="my-2 h-4 bg-gray-200 rounded-full w-4/5" />

      {/* Rating Section Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-[12px] sm:w-[15px] h-[12px] sm:h-[15px] bg-gray-200 rounded-sm"
            />
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded-full w-10 sm:w-12" />
      </div>

      {/* Price Section Skeleton */}
      <div className="flex justify-between my-1 items-baseline">
        <div className="flex items-baseline gap-1">
          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-6 sm:w-8" />
        </div>
        <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-14 sm:w-16" />
      </div>

      {/* Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 animate-shimmer" />
    </div>
  );
};
