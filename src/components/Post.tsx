import { api } from "~/utils/api";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { Post } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

type PostProps = {
  post: Post;
  userId: number;
};

const Post: React.FC<PostProps> = ({ post, userId }) => {
  // State Hooks
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [expandedDescription, setExpandedDescription] = useState(false);

  // Custom Hooks and API Hooks
  const createLike = api.post.toggleLike.useMutation();
  const getLikes = api.post.getLikesByPostId.useQuery({ postId: post.id });
  const createComment = api.post.addComment.useMutation();
  const deletePost = api.post.deletePost.useMutation();
  const deleteComment = api.post.deleteComment.useMutation();
  const savePost = api.post.bookmarkPost.useMutation();
  const posted = api.post.getAllPosts.useQuery();
  const getBookmarks = api.post.getBookmarksByPostId.useQuery({
    postId: post.id,
  });
  const commentsQuery = api.post.getCommentsByPostId.useQuery({
    postId: post.id,
  });

  // Animation hooks
  const likesControls = useAnimation();
  const commentControls = useAnimation();
  const bookmarkControls = useAnimation();

  // Effects
  useEffect(() => {
    likesControls.start({ scale: isLiked ? 1.2 : 1 });
    bookmarkControls.start({ scale: isBookmarked ? 1.2 : 1 });
  }, [isLiked, isBookmarked]);

  useEffect(() => {
    const userLike = getLikes.data?.find((like) => like.userId === userId);
    setIsLiked(!!userLike);

    const userBookmark = getBookmarks.data?.find(
      (bookmark) => bookmark.userId === userId
    );
    setIsBookmarked(!!userBookmark);
  }, [getLikes.data, userId, getBookmarks.data]);

  const [comments, setComments] = useState<any[]>(
    commentsQuery.data ? [...commentsQuery.data] : []
  );
  const { toast } = useToast();

  const handleLike = (id: number) => {
    createLike.mutate(
      { userId: userId, postId: id },
      {
        onSuccess: async () => {
          const updatedLikes = (await getLikes.refetch()).data.length;
          setLikes(updatedLikes);
          setIsLiked((prev) => updatedLikes > likes); // toggle the liked state
        },
      }
    );
  };
  const handleDelete = (id: number) => {
    deletePost.mutate({ postId: id },
      {
        onSuccess: async () => {
          console.log("yo");
          await posted.refetch().data;

        },
      })
  };

  const handleDeleteComment = (id: number) => {
    deleteComment.mutate(
      { postId: post.id, commentId: id },
      {
        onSuccess: async () => {
          setComments(await commentsQuery.refetch().data);
          toast({
            title: "Comment Deleted",
            description: "Your comment has been removed.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Unable to delete the comment.",
          });
        },
      }
    );
  };

  const handleSave = (id: number) => {
    savePost.mutate(
      { userId: userId, postId: id },
      {
        onSuccess: () => {
          setIsBookmarked((prev) => !prev); // toggle the bookmarked state
          toast({ title: "Post Saved", description: "You have great taste!" });
        },
      }
    );
  };

  const handleViewComments = async () => {
    setShowComments(!showComments);
  };

  const handleComment = (id: number) => {
    createComment.mutate(
      { userId: userId, postId: id, content: comment },
      {
        onSuccess: async () => {
          setComments(await commentsQuery.refetch().data);
        },
      }
    );
    setComment("");
  };

  function formatDate(date: Date): string {
    return formatDistanceToNow(new Date(date)) + " ago";
  }

  const isOwner = userId === post.userId;
console.log("username",post.user?.userName)
console.log("img",post.user?.image)
  return (
    <motion.div
      className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center justify-center rounded-lg bg-stitched-black p-8 text-white shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={post.id}
    >
      {/* Post Header */}
      <div className="post-header borde mb-4 flex w-full items-center justify-between">
        {/* Poster's Image */}
        <div className="flex">
          <motion.div className="relative mr-4 h-12 w-12 transform overflow-hidden rounded-full transition-all hover:scale-105">
            <Image
              src={post.user?.image || "/placeholder.png"}
              alt={post.user?.userName || "Anonymous"}
              layout="fill"
              objectFit="cover"
            />
          </motion.div>

          {/* Poster's Name & time created */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">
              {post.user?.userName || "Anonymous"}
            </h4>
            <time className="text-sm text-gray-600">
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => handleDelete(post.id)}
            className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post brands */}
      <div className="mt-2 flex flex-wrap">
        {post.brandTags?.map((tag, index) => (
          <Badge
            key={index}
            className="mb-2 mr-2 bg-stitched-darkGray px-4 py-1.5"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="p-5" />

      {/* Post content */}
      <Image
        src={post.imageUrl}
        width={600}
        height={400}
        alt="post"
        className="rounded"
      />

      {/* Post Description */}
      <p className="my-4 leading-relaxed text-gray-300">
        {expandedDescription || post.description.length <= 100
          ? post.description
          : `${post.description.substring(0, 100)}...`}
        {post.description.length > 100 && (
          <span
            className="ml-2 cursor-pointer text-white"
            onClick={() => setExpandedDescription(!expandedDescription)}
          >
            {expandedDescription ? "Show less" : "Read more"}
          </span>
        )}
      </p>

      {/* Actions */}
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLike(post.id)}
          >
            <div className="flex items-center space-x-2">
              {isLiked ? (
                <FaHeart color="#F70085" size={24} />
              ) : (
                <FaHeart size={24} />
              )}
              <span className="text-white">{likes}</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleViewComments}
          >
            <FaRegCommentDots size={24} className="text-white" />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSave(post.id)}
        >
          {isBookmarked ? (
            <FaBookmark color="blue" size={24} />
          ) : (
            <FaBookmark size={24} className="text-white" />
          )}
        </motion.button>
      </div>

      {/* Comments */}
      <div className="w-full">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)}
          placeholder="Write a comment..."
          className="mb-2 w-full rounded bg-transparent p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stitched-lightPink"
        />

        <div className="flex gap-5">
          <Button
            Button
            className="btn w-full bg-stitched-lightPink hover:bg-stitched-pink focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleComment(post.id)}
          >
            Comment
          </Button>

          <Button
            className="btn w-full bg-stitched-lightPink hover:bg-stitched-pink focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleViewComments}
          >
            {showComments ? "Hide Comments" : "View Comments"}
          </Button>
        </div>

        {showComments &&
          commentsQuery.data?.map((comment) => (
            <div key={comment.id} className="mt-4">
              <p className="text-gray-300">{comment.content}</p>
              {(comment.userId === userId || isOwner) && (
                <Button
                  className="btn bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  variant="outline"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default Post;