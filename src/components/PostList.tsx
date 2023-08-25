import { Post } from "~/types";
import { api } from "~/utils/api";
import {Button} from "@/components/ui/button";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

type Props = {
  // posts: Post[];
  userId: string
};

function PostList({ userId }: Props) {
  const posts = api.post.getAllPosts.useQuery();
  let postsData = posts.data
  const createLike = api.post.toggleLike.useMutation();

  console.log(postsData)

  const handleLike = (userId: string, id: number) => {
    console.log('liked');
    createLike.mutate({
      userId: userId,
      postId: id,
    })
    console.log("hi")
  }

  return (
    <div>
      {postsData?.map(({id, description, brandTags, imageUrl, likesCount}) => (
        <div key={id}>
          <h3>{description}</h3>
          <img src={imageUrl} alt="post" />
          <p>{brandTags}</p>
          <p>{likesCount}</p>
          <Button className="bg-stitched-lightPink" variant="outline">Save</Button>
          <Button variant="outline" className="bg-stitched-lightPink" onClick={() => handleLike(userId, id)}>Like</Button>
          <Button className="bg-stitched-lightPink" variant="outline">Comment</Button>
        </div>
      ))}
    </div>
  );
}

export default PostList;