import { Post as PostType } from "~/types";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import {Button} from "@/components/ui/button";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

type PostProps = {
  post: PostType;
  userId: string;
};
const Post: React.FC<PostProps> = ({ post, userId }) => {
  const [showComments, setShowComments] = useState(false); // Add state variable for showing comments
  const createLike = api.post.toggleLike.useMutation();
  const createComment = api.post.addComment.useMutation(); 
  const deletePost = api.post.deletePost.useMutation();
  const deleteComment = api.post.deleteComment.useMutation();
  const savePost = api.post.bookmarkPost.useMutation();
  const [comment, setComment] = useState('');
  let commentsQuery = api.post.getCommentsByPostId.useQuery({ postId: post.id });
  const [clickCount, setClickCount] = useState(2);
  const [comments, setComments] = useState<any[]>(commentsQuery.data ? [...commentsQuery.data] : []);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [likeClick, setLikeClick] = useState(0);
  //problem is the likes count is not updating
  // console.log("likes reg", post.likesCount)
  // useEffect(() => {
  //   console.log('Likes updated to:', likesCount)
  //   console.log("neww", post.likesCount)
  // }, [likeClick])
  // const handleLike = (id: number) => {
  //   createLike.mutate({
  //     userId: userId,
  //     postId: id,
  //   })
  //   console.log("new", post.likesCount)
  //   setLikeClick(likeClick + 1);
  //   setLikesCount(post.likesCount);
  // }
  const handleLike = (id: number) => {
    createLike.mutate({
      userId: userId,
      postId: id,
    }, {
      onSuccess: (data) => {
        setLikesCount(data);
      }
    });
  }
  
 const handleDelete = (id: number) => {
   deletePost.mutate({
     postId: id
   })
 }
 const handleDeleteComment = (id: number) => {
   deleteComment.mutate({
      postId: post.id,
     commentId: id
   })
 }
 const handleSave = (id: number) => {
   savePost.mutate({
     userId: userId,
     postId: id
   })
  }
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
  setComment('');
  setComments([...comments, { id: comments.length + 1, content: comment }]);
};
const isOwner = userId === post.userId;
  return (
    <div key={post.id}>
      <img src={post.imageUrl} alt="post" />
      <h3>{post.description}</h3>
      <p>{post.brandTags}</p>
      <p>{likesCount}</p>
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
      <Button className="bg-stitched-lightPink" variant="outline" onClick={() => handleViewComments(post.id)}>View Comments</Button>
      {showComments && (
        <>
          {commentsQuery.data?.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <Button className="bg-stitched-lightPink" variant="outline" onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
            </div>
      ))}
        </>
      )}
    </div>
  );
}

function PostList({ userId }: PostListProps) {
  const posts = api.post.getAllPosts.useQuery();
  let postsData = posts.data;

  return (
    <div>
      {postsData?.map((post) => (
        <Post key={post.id} post={post} userId={userId} />
      ))}
    </div>
  );
}

export default PostList;