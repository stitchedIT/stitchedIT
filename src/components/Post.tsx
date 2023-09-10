import { api } from "~/utils/api";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaRegCommentDots, FaBookmark, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { Post } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { DialogOverlay } from "@radix-ui/react-dialog";

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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">
                Delete
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-stitched-black text-white">
              <AlertDialogHeader className="bg-stitched-black">
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="bg-black">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(post.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleViewComments}
              >
                <FaRegCommentDots size={24} className="text-white" />
              </motion.button>
            </DialogTrigger>

            <DialogOverlay>
              <DialogContent>
                <div className="flex gap-5">
                  {/* Left column for the post details */}
                  <div className="flex w-1/2 items-center justify-center">
                    <Image
                      src={post.imageUrl}
                      layout="responsive"
                      width={100}
                      height={100}
                      alt="post"
                      className="mb-4 h-full w-full rounded object-cover"
                    />
                    {/* ... (other post details here) */}
                  </div>

                  {/* Right column for the comments and comment form */}
                  <div className="w-1/2">
                    {/* Post profile pic + username + timestamp */}
                    <div className="mb-4 flex items-center">
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
                        <h4 className="mb-1 text-lg font-semibold">
                          {post.user?.userName || "Anonymous"}
                        </h4>
                        <time className="text-sm text-gray-600">
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>

                    {/* Post description */}
                    <p className="my-4 max-h-[50px] overflow-y-auto leading-relaxed text-gray-300">
                      {post.description}
                    </p>

                    {/* Brand tags */}
                    <div className="mb-4 flex flex-wrap">
                      {post.brandTags?.map((tag, index) => (
                        <Badge
                          key={index}
                          className="mb-2 mr-2 rounded-full bg-stitched-darkGray px-4 py-1.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Comment Form */}
                    <div className="relative mb-2 flex w-full items-center">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleComment(post.id)
                        }
                        className="w-full flex-grow bg-transparent p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stitched-lightPink rounded-lg"
                      />

                      <Button
                        className="py-5 btn ml-2 bg-stitched-lightPink hover:bg-stitched-pink focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => handleComment(post.id)}
                      >
                        Comment
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="max-h-[50vh] overflow-y-auto">
                      {commentsQuery.data?.map((comment) => (
                        <div
                          key={comment.id}
                          className="mt-4 rounded-lg bg-stitched-black p-3 shadow-lg"
                        >
                          <div className="flex items-start space-x-2">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                src={comment.user.image || "/placeholder.png"}
                                alt={comment.user.userName || "Anonymous"}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <div className="flex flex-grow flex-col">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-white">
                                    {comment.user.userName || "Anonymous"}
                                  </h4>
                                  <time className="text-xs text-gray-400">
                                    {formatDate(comment.createdAt)}
                                  </time>
                                </div>
                                {(comment.user.id === userId || isOwner) && (
                                  <button
                                    className="text-red-500 hover:text-red-600 focus:outline-none"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                )}
                              </div>
                              <p className="mt-2 text-gray-300">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </DialogOverlay>
          </Dialog>
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
        <div className="relative mb-2 flex w-full">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)}
            className="mb-2 w-full flex-grow bg-transparent p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stitched-lightPink"
          />
          <Button
            className="btn absolute bottom-2 right-2 mb-3 bg-stitched-lightPink hover:bg-stitched-pink focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleComment(post.id)}
          >
            Comment
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Post;