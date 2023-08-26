import Head from "next/head";
import { Post as PostType } from "~/types";
import { type NextPage } from "next";
import React from "react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useUser, useSession } from '@clerk/clerk-react';
import {Button} from "@/components/ui/button";
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
  const isOwner = userId === post.userId;
    return (
      <div key={post.id}>
        <img src={post.imageUrl} alt="post" />
        <h3>{post.description}</h3>
        <p>{post.brandTags}</p>
        <p>{post.likesCount}</p>
        <Button className="bg-stitched-lightPink" variant="outline" onClick={() => handleSave(post.id)}>Save</Button>
        <Button variant="outline" className="bg-stitched-lightPink" onClick={() => handleLike(post.id)}>Like</Button>
      {isOwner &&  <Button variant="outline" className="bg-stitched-lightPink" onClick={() => handleDelete(post.id)}>Delete</Button>}
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
const PostPage: NextPage = () => {
    const { user } = useUser();
    const userId = user?.id ?? '';
    // const userId = "user_2UUskji2PFEWfOoxku2jNHen7oa";
    const bookmarkedPostsQuery = api.post.getBookmarkedPosts.useQuery({
        userId,
    });
    console.log("user", userId)
    const bookmarkedPosts = bookmarkedPostsQuery.data;
    console.log(bookmarkedPosts);
    return (
        <div>
          <h1>Your Bookmarked Posts</h1>
        {bookmarkedPosts?.map((post) => (
            <Post key={post.id} post={post} userId={userId} />
        ))}
        </div>
      );
}

export default PostPage;