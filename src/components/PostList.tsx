import { api } from "~/utils/api";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
// import { Toaster } from "@/components/ui/toaster";

type PostListProps = {
  userId: string;
};

function PostList({ userId }: PostListProps) {
  const { data: postsData, isLoading } = api.post.getAllPosts.useQuery();

  if (isLoading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </>
    )
  }

  return (
    <div>
      {postsData?.map((post: Post) => (
        <Post key={post.id} post={post} userId={userId} />
      ))}
      {/* <Toaster /> */}
    </div>
  );
}

export default PostList;

