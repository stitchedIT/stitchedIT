import React, { useState } from "react";
import { api } from "~/utils/api";
import { GetServerSideProps } from "next";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import {supabase} from "supabaseClient.js";

type FormData = {
  userId: string;
  description?: string;
  brandTags: string;
  imageUrl: string;
};

type Props = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { ...buildClerkProps(ctx.req), userId } };
};

function CreatePostComponent({ userId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    description: undefined,
    brandTags: "",
    imageUrl: "",
  });

  const createPost = api.post.addPost.useMutation();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const postFile = event.target.files && event.target.files[0];
    
    if (!postFile) return;

    const path = `posts/${postFile.name}`;
    
    const { error } = await supabase
      .storage
      .from('pictures')
      .upload(path, postFile);

    if (error) {
        console.error("Failed to upload:", error);
    } else {
        const imageUrl = `https://xwhmshfqmtdtneasprwx.supabase.co/storage/v1/object/public/pictures/${path}`;
        setFormData((prev) => ({ ...prev, imageUrl }));
    }
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formData.userId = userId || "";

    const tagsArray = formData.brandTags.split(",").map((tag) => tag.trim());

    createPost.mutate({
      ...formData,
      brandTags: tagsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stitched-sand  p-8 rounded-lg  shadow-md w-full max-w-lg mx-auto mt-12">
      <textarea
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Description"
        className="w-full p-4 rounded-md border-stitched-darkGray focus:outline-stitched-lightPink text-white bg-stitched-darkGray focus:border-stitched-pink resize-none"
      />

      <div className="mt-4">
        <input
          value={formData.brandTags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, brandTags: e.target.value }))
          }
          placeholder="Add brand tags (comma separated)"
          className="w-full p-4 rounded-md bg-stitched-darkGray text-white border-stitched-darkGray focus:outline-stitched-lightPink focus:border-stitched-pink"
        />
      </div>

      <div className="mt-4">
        <input
          type="file"
          onChange={handleFileUpload}
          className="w-full p-4 rounded-md bg-stitched-darkGray text-white border-stitched-darkGray focus:outline-black focus:border-stitched-pink"
        />
      </div>

      <button type="submit" className="mt-6 bg-stitched-pink text-stitched-lightPink px-6 py-2 rounded-md hover:bg-stitched-darkGray hover:text-stitched-sand focus:outline-none">
        Create Post
      </button>
    </form>
  );
}

export default CreatePostComponent;
