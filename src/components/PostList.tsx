import { Post } from "~/types";
import { api } from "~/utils/api";
import { useState } from "react";
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
  const createComment = api.post.addComment.useMutation(); 
  console.log(postsData)

  const [comment, setComment] = useState('');
  const [likes, setLikes] = useState(0);
  const handleLike = (userId: string, id: number) => {
    console.log('liked');
    createLike.mutate({
      userId: userId,
      postId: id,
    })
    // setLikes();
  }
  const handleComment = (userId: string, id: number) => {
    createComment.mutate({
      userId: userId,
      postId: id,
      content: comment,
    })
    setComment('');
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
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button className="bg-stitched-lightPink" variant="outline" onClick={() => handleComment(userId, id)}>Comment</Button>
        </div>
      ))}
    </div>
  );
}

export default PostList;