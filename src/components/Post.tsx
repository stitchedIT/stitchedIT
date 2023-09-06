import { api } from "~/utils/api";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import Image from "next/image";


const Post: React.FC<PostProps> = ({ post, userId }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);
  const createLike = api.post.toggleLike.useMutation();
  const getLikes = api.post.getLikesByPostId.useQuery({ postId: post.id });
  const createComment = api.post.addComment.useMutation();
  const deletePost = api.post.deletePost.useMutation();
  const deleteComment = api.post.deleteComment.useMutation();
  const savePost = api.post.bookmarkPost.useMutation();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const getBookmarks = api.post.getBookmarksByPostId.useQuery({
    postId: post.id,
  });

  useEffect(() => {
    const userLike = getLikes.data?.find((like) => like.userId === userId);
    setIsLiked(!!userLike);

    const userBookmark = getBookmarks.data?.find(
      (bookmark) => bookmark.userId === userId
    );
    setIsBookmarked(!!userBookmark);
  }, [getLikes.data, userId, getBookmarks.data]);

  const commentsQuery = api.post.getCommentsByPostId.useQuery({
    postId: post.id,
  });

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
    deletePost.mutate({ postId: id });
  };

  const handleDeleteComment = (id: number) => {
    deleteComment.mutate({ postId: post.id, commentId: id });
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

  const handleViewComments = () => {
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

  return (
    <div
      className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center justify-center rounded-lg bg-stitched-black p-8 text-white shadow-md outline-dashed"
      key={post.id}
    >
      {/* Post Header */}
      <div className="post-header mb-4 flex w-full items-center border-b pb-4">

        {/* Poster's Image */}
        <div className="relative mr-4 h-10 w-10">
          <Image
            src={post.user?.image || "/placeholder.png"}
            alt={post.user?.userName || "Anonymous"}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        {/* Poster's Name */}
        <h4 className="flex-1 font-bold">
          {post.user?.userName || "Anonymous"}
        </h4>

        {/* Post creation date */}
        <time className="text-sm text-gray-500">
          {formatDate(post.createdAt)}
        </time>
      </div>

      {/* Post content (the image) */}
      <Image src={post.imageUrl} width={600} height={400} alt="post" />

      {/* Post Footer */}
      <div className="mt-4 w-full">
        <p className="mb-4">{post.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => handleLike(post.id)}>
              <div className="flex items-center space-x-2">
                {isLiked ? (
                  <FaHeart color="#F70085" size={24} />
                ) : (
                  <FaHeart size={24} />
                )}
                <span>{likes}</span>
              </div>
            </button>
            <button onClick={handleViewComments}>
              <FaRegCommentDots size={24} />
            </button>
          </div>

          <button onClick={() => handleSave(post.id)}>
            {isBookmarked ? (
              <FaBookmark color="blue" size={24} />
            ) : (
              <FaBookmark size={24} />
            )}
          </button>
        </div>

        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2 mt-4 w-full rounded border bg-white p-2 text-black shadow-inner"
        />

        <Button
          className="btn mb-2 w-full bg-stitched-lightPink"
          variant="outline"
          onClick={() => handleComment(post.id)}
        >
          Comment
        </Button>
        <Button
          className="btn w-full bg-stitched-lightPink"
          variant="outline"
          onClick={() => handleViewComments(post.id)}
        >
          View Comments
        </Button>

        {showComments &&
          commentsQuery.data?.map((comment) => (
            <div key={comment.id} className="mt-4">
              <p>{comment.content}</p>
              <Button
                className="btn bg-stitched-lightPink"
                variant="outline"
                onClick={() => handleDeleteComment(comment.id)}
              >
                Delete
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Post;