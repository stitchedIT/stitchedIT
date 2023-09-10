import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaRegCommentDots, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import { Input } from "@/@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const CommentModal = ({
  post,
  handleViewComments,
  handleComment,
  handleDeleteComment,
  commentsQuery,
  userId,
  isOwner,
}) => {
    const [commentText, setCommentText] = useState("");

  return (
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
            <div className="flex w-1/2 items-center justify-center relative">
                <Image
                src={post.imageUrl}
                layout="fill"
                objectFit="cover"
                alt="post"
                className="rounded"
                />
                {/* ... (other post details here) */}
            </div>

            {/* Right column for the comments and comment form */}
            <div className="w-1/2">
              {/* Post profile pic + username + timestamp */}
              <div className="mb-4 flex items-center">
                <motion.div className="relative mr-4 h-12 w-12 transform overflow-hidden rounded-full transition-all hover:scale-105">
                  <Avatar>
                    <AvatarImage
                      className="w-[60px] rounded-full"
                      src={post.user?.image || "/placeholder.png"}
                      alt={post.user?.userName || "Anonymous"}
                    />
                    <AvatarFallback>{post.user?.userName}</AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* Poster's Name & time created */}
                <div className="flex flex-col">
                  <h4 className="mb-1 text-lg font-semibold">
                    {post.user?.userName || "Anonymous"}
                  </h4>
                  <time className="text-sm text-gray-600">
                    {formatDistanceToNow(post.createdAt)}
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
                <Input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment(post.id, commentText);
                      setCommentText("");
                    }
                  }}
                  className="w-full flex-grow rounded-lg bg-transparent p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-stitched-lightPink"
                />

                <Button
                  className="btn ml-2 bg-stitched-lightPink py-5 hover:bg-stitched-pink focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => {
                    handleComment(post.id, commentText);
                    setCommentText("");
                  }}
                >
                  Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="max-h-[50vh] overflow-y-auto">
                {commentsQuery.data?.map((comment) => (
                  <div
                    key={comment.id}
                    className="overflow-wrap break-word mt-4 flex min-w-[60%] max-w-[95%] flex-col whitespace-pre-wrap rounded-lg bg-stitched-black p-3 shadow-lg"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarImage
                            className="w-[60px] rounded-full"
                            src={comment.user?.image || "/placeholder.png"}
                            alt={comment.user?.userName || "Anonymous"}
                          />
                          <AvatarFallback>
                            {comment.user?.userName}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex w-full flex-grow flex-col">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-white">
                              {comment.user.userName || "Anonymous"}
                            </h4>
                            <time className="text-xs text-gray-400">
                              {formatDistanceToNow(comment.createdAt)}
                            </time>
                          </div>
                          {(comment.user.id === userId || isOwner) && (
                            <button
                              className="text-red-500 hover:text-red-600 focus:outline-none"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                        <p className="max-h-[100px] overflow-y-auto break-words text-gray-300">
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
  );
};

export default CommentModal;