import React, { useState } from "react";
import { api } from "~/utils/api";
import { supabase } from "supabaseClient.js";

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const postFile = event.target.files && event.target.files[0];

    if (!postFile) return;

    const path = `feed/${postFile.name}`;

    const { error } = await supabase.storage
      .from("pictures")
      .upload(path, postFile);

    if (error) {
      console.error("Failed to upload:", error);
    } else {
      const imageUrl = `https://xwhmshfqmtdtneasprwx.supabase.co/storage/v1/object/public/pictures/${path}`;
      setFormData((prev) => ({ ...prev, imageUrl }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formData.userId = userId || "";

    const tagsArray = formData.brandTags.split(",").map((tag) => tag.trim());

    createPost.mutate(
      {
        ...formData,
        brandTags: tagsArray,
      },
      {
        onSuccess: async () => {
          await posts.refetch().data;
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-2 w-full max-w-2xl rounded-lg border border-stitched-lightPink bg-stitched-black p-8 shadow-md "
    >
      <textarea
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Description"
        className="w-full resize-none rounded-md border-stitched-darkGray bg-stitched-darkGray p-4 text-white focus:border-stitched-pink focus:outline-stitched-lightPink"
      />

      <div className="mt-4">
        <input
          value={formData.brandTags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, brandTags: e.target.value }))
          }
          placeholder="Add brand tags (comma separated)"
          className="w-full rounded-md border-stitched-darkGray bg-stitched-darkGray p-4 text-white focus:border-stitched-pink focus:outline-stitched-lightPink"
        />
      </div>

      <div className="mt-4">
        <label
          className="
  block 
  w-full 
  cursor-pointer 
  rounded-md 
  border 
  border-stitched-darkGray 
  bg-gradient-to-r 
  from-stitched-pink 
  via-stitched-lightPink
   to-stitched-pink 
  p-4 
  text-center 
  text-black 
  shadow-lg 
  transition 
  duration-200
  ease-in-out 
  hover:shadow-xl 
  focus:outline-none
  focus:ring-4 focus:ring-purple-500"
        >
          Choose Image
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-md bg-stitched-pink px-6 py-2 text-stitched-darkGray hover:bg-stitched-lightPink focus:outline-none"
      >
        Create Post
      </button>
    </form>
  );
}

export default CreatePostComponent;
