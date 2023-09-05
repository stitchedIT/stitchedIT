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
  const [showComments, setShowComments] = useState(false); // Add state variable for showing comments
  const [likes, setLikes] = useState(post.likesCount);
  const createLike = api.post.toggleLike.useMutation();
  const getLikes = api.post.getLikesByPostId.useQuery({
    postId: post.id,
  });
  const createComment = api.post.addComment.useMutation();
  const deletePost = api.post.deletePost.useMutation();
  const deleteComment = api.post.deleteComment.useMutation();
  const savePost = api.post.bookmarkPost.useMutation();
  const [comment, setComment] = useState("");
  const commentsQuery = api.post.getCommentsByPostId.useQuery({
    postId: post.id,
  });
  const [clickCount, setClickCount] = useState(2);
  const [comments, setComments] = useState<any[]>(
    commentsQuery.data ? [...commentsQuery.data] : []
  );

  const handleLike = (id: number) => {
    createLike.mutate(
      {
        userId: userId,
        postId: id,
      },
      {
        onSuccess: async () => {
          setLikes((await getLikes.refetch()).data.length);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deletePost.mutate(
      {
        postId: id,
      },
      {
        onSuccess: async () => {},
      }
    );
  };
  const handleDeleteComment = (id: number) => {
    deleteComment.mutate({
      postId: post.id,
      commentId: id,
    });
  };
  const handleSave = (id: number) => {
    savePost.mutate({
      userId: userId,
      postId: id,
    });
  };

  const handleViewComments = (id: number) => {
    setClickCount(clickCount + 1);
    setShowComments(clickCount % 2 === 0);
  };
  const handleComment = (id: number) => {
    createComment.mutate({
      userId: userId,
      postId: id,
      content: comment,
    });
    setComment("");
    setComments([...comments, { id: comments.length + 1, content: comment }]);
  };

  const isOwner = userId === post.userId;
  return (
    <div
      className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center justify-center rounded-lg  bg-stitched-black p-8 text-white shadow-md outline-dashed"
      key={post.id}
    >
      <img src={post.imageUrl} width={600} alt="post" />
      <h3>{post.description}</h3>
      <p>Brand Tags: {post.brandTags}</p>
      <p>{likes}</p>
      <div className="flex flex-row">
        <Button
          className="mr-2 bg-stitched-lightPink"
          variant="outline"
          onClick={() => handleSave(post.id)}
        >
          Save
        </Button>
        <Button
          variant="outline"
          className="ml-2 bg-stitched-lightPink"
          onClick={() => handleLike(post.id)}
        >
          Like
        </Button>
        {isOwner && (
          <Button
            variant="outline"
            className="ml-2 bg-stitched-lightPink"
            onClick={() => handleDelete(post.id)}
          >
            Delete
          </Button>
        )}
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <Button
        className="bg-stitched-lightPink"
        variant="outline"
        onClick={() => handleComment(post.id)}
      >
        Comment
      </Button>
      <Button
        className="bg-stitched-lightPink"
        variant="outline"
        onClick={() => handleViewComments(post.id)}
      >
        View Comments
      </Button>
      {showComments && (
        <>
          {commentsQuery.data?.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <Button
                className="bg-stitched-lightPink"
                variant="outline"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
const PostPage: NextPage = () => {
    const { user } = useUser();
    const userId = user?.id ?? '';
    // const userId = "user_2UUskji2PFEWfOoxku2jNHen7oa";
    const bookmarkedPostsQuery = api.post.getBookmarkedPosts.useQuery({
        userId,
    });
    const bookmarkedPosts = bookmarkedPostsQuery.data;
    return (
        <div className="bg-stitched-darkGray p-5 md:px-20">
          <h1>Your Bookmarked Posts</h1>
        {bookmarkedPosts?.map((post) => (
            <Post key={post.id} post={post} userId={userId} />
        ))}
        </div>
      );
}

export default PostPage;