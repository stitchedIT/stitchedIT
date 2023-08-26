import { Post as PostType } from "~/types";
import { api } from "~/utils/api";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

type PostProps = {
  post: PostType;
  userId: string;
};

const Post: React.FC<PostProps> = ({ post, userId }) => {
  const createLike = api.post.toggleLike.useMutation();
  const createComment = api.post.addComment.useMutation(); 
  const deletePost = api.post.deletePost.useMutation();
  const savePost = api.post.bookmarkPost.useMutation();
  const [comment, setComment] = useState('');

  const handleLike = (id: number) => {
    createLike.mutate({
      userId: userId,
      postId: id,
    })
  }
 const handleDelete = (id: number) => {
   deletePost.mutate({
     postId: id
   })
 }
 const handleSave = (id: number) => {
   savePost.mutate({
     userId: userId,
     postId: id
   })
 }

  const handleComment = (id: number) => {
    createComment.mutate({
      userId: userId,
      postId: id,
      content: comment,
    })
    setComment('');
  }

  return (
    <div key={post.id}>
      <h3>{post.description}</h3>
      <img src={post.imageUrl} alt="post" />
      <p>{post.brandTags}</p>
      <p>{post.likesCount}</p>
      <Button className="bg-stitched-lightPink" variant="outline" onClick={() => handleSave(post.id)}>Save</Button>
      <Button variant="outline" className="bg-stitched-lightPink" onClick={() => handleLike(post.id)}>Like</Button>
      <Button variant="outline" className="bg-stitched-lightPink" onClick={() => handleDelete(post.id)}>Delete</Button>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <Button className="bg-stitched-lightPink" variant="outline" onClick={() => handleComment(post.id)}>Comment</Button>
    </div>
  );
}

type PostListProps = {
  userId: string
};

function PostList({ userId }: PostListProps) {
  const posts = api.post.getAllPosts.useQuery();
  let postsData = posts.data

  return (
    <div>
      {postsData?.map((post) => (
        <Post key={post.id} post={post} userId={userId} />
      ))}
    </div>
  );
}

export default PostList;