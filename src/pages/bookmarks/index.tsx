import { type NextPage } from "next";
import React from "react";
import { api } from "~/utils/api";
import { useUser } from '@clerk/clerk-react';
import Post from "~/components/Post";

const BookmarkPage: NextPage = () => {
    const { user } = useUser();
    const userId = user?.id ?? '';
    // const userId = "user_2UUskji2PFEWfOoxku2jNHen7oa";
    const bookmarkedPostsQuery = api.post.getBookmarkedPosts.useQuery({
        userId,
    });
    const bookmarkedPosts = bookmarkedPostsQuery.data;
    return (
        <div className="bg-stitched-black p-5 md:px-20">
          <h1 className="text-3xl text-stitched-lightPink text-center">Your Bookmarked Posts</h1>
        {bookmarkedPosts?.map((post) => (
            <Post key={post.id} post={post} userId={userId} />
        ))}
        </div>
      );
}

export default BookmarkPage;