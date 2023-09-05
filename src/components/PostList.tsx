import { Post as PostType } from "~/types";
import { api } from "~/utils/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

type PostProps = {
  post: PostType;
  userId: string;
};

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
          setLikes((await getLikes.refetch()).data.length);
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
    savePost.mutate({ userId: userId, postId: id });
    toast({ title: "Post Saved", description: "You have great taste!" });
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

  const isOwner = userId === post.userId;

  return (
    <div
      className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center justify-center rounded-lg bg-stitched-black p-8 text-white shadow-md outline-dashed"
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
          className="ml-2 bg-stitched-lightPink"
          variant="outline"
          onClick={() => handleLike(post.id)}
        >
          Like
        </Button>
        {isOwner && (
          <Button
            className="ml-2 bg-stitched-lightPink"
            variant="outline"
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
        className="text-black"
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
        onClick={handleViewComments}
      >
        View Comments
      </Button>
      {showComments && (
        <>
          {commentsQuery.data?.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              {isOwner && (
                <Button
                  className="bg-stitched-lightPink"
                  variant="outline"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

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
      <Toaster />
    </div>
  );
}

export default PostList;
