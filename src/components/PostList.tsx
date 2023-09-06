import { api } from "~/utils/api";
import Post from "./Post";
// import { Toaster } from "@/components/ui/toaster";

type PostListProps = {
  userId: string;
};

function PostList({ userId }: PostListProps) {
  const posts = api.post.getAllPosts.useQuery();
  let postsData = posts.data;

  return (
    <div>
      {postsData?.map((post) => (
        <Post key={post.id} post={post} userId={userId} />
      ))}
      {/* <Toaster /> */}
    </div>
  );
}

export default PostList;
