import { Skeleton } from "@/components/ui/skeleton";

function PostSkeleton() {
  return (
    <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center justify-center rounded-lg bg-stitched-black p-8 text-white shadow-lg">
      {/* Post Header */}
      <div className="post-header mb-4 flex w-full items-center justify-between">
        <div className="flex">
          <div className="relative mr-4 h-12 w-12 transform overflow-hidden rounded-full transition-all hover:scale-105">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          </div>
          <div className="flex flex-col">
            <Skeleton className="mb-2 h-4 w-32 rounded bg-gray-400" />
            <Skeleton className="h-4 w-24 rounded bg-gray-400" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded bg-gray-400" />
      </div>

      {/* Post brands */}
      <div className="mt-2 flex flex-wrap">
        <Skeleton className="mb-2 mr-2 h-4 w-24 rounded bg-gray-400" />
        <Skeleton className="mb-2 mr-2 h-4 w-20 rounded bg-gray-400" />
      </div>

      {/* Image placeholder */}
      <Skeleton className="my-4 h-64 w-full rounded bg-gray-400" />

      {/* Post Description */}
      <Skeleton className="my-2 h-4 w-3/4 rounded bg-gray-400" />
      <Skeleton className="my-2 h-4 w-1/2 rounded bg-gray-400" />

      {/* Actions */}
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-8 rounded bg-gray-400" />
          <Skeleton className="h-8 w-8 rounded bg-gray-400" />
        </div>
        <Skeleton className="h-8 w-8 rounded bg-gray-400" />
      </div>

      {/* Comments */}
      <div className="w-full">
        <div className="relative mb-2 flex w-full">
          <Skeleton className="mb-2 h-12 w-full rounded bg-gray-400" />
          <Skeleton className="absolute bottom-2 right-2 mb-2 h-8 w-24 rounded bg-gray-400" />
        </div>
      </div>
    </div>
  );
}

export default PostSkeleton
