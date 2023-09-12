import React, { useState } from "react";
import { api } from "~/utils/api";
import {supabase} from "supabaseClient.js";

type FormData = {
  userId: string;
  description: string;
  brandTags: string;
  imageUrl: string;
};

type Props = {
  userId: string;
};

function CreatePostComponent({ userId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    description: "",
    brandTags: "",
    imageUrl: "",
  });

  const createPost = api.post.addPost.useMutation();
  const posts = api.post.getAllPosts.useQuery();
  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const postFile = event.target.files && event.target.files[0];
    
    if (!postFile) return;

    const path = `feed/${postFile.name}`;
    
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
    },
    {
      onSuccess: async () => {
        await posts.refetch().data;
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stitched-black p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-2 border border-stitched-lightPink ">
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

      <button type="submit" className="mt-6 bg-stitched-pink text-stitched-darkGray px-6 py-2 rounded-md hover:bg-stitched-lightPink focus:outline-none">
        Create Post
      </button>
    </form>
  );
}

export default CreatePostComponent;
