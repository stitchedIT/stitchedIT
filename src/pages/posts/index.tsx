import React, { useState } from "react";
import { api } from "~/utils/api";
import { GetServerSideProps } from "next";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import * as LR from "@uploadcare/blocks";
type FormData = {
  userId: string;
  description?: string;
  brandTags: string; // Changed this to a string
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
    brandTags: "", // Changed this to an empty string
    imageUrl: "",
  });

  const createPost = api.post.addPost.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formData.userId = userId || "";

    // Split the brandTags string into an array
    const tagsArray = formData.brandTags.split(",").map((tag) => tag.trim());

    // Update the formData with the tagsArray before sending to the API
    createPost.mutate({
      ...formData,
      brandTags: tagsArray,
    });
  };

  LR.registerBlocks(LR);
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Description"
      />

      <div>
        <input
          value={formData.brandTags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, brandTags: e.target.value }))
          }
          placeholder="Add brand tags (comma separated)"
        />
      </div>

      <input
        value={formData.imageUrl}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
        }
        placeholder="Image URL"
      />
      <lr-config
        ctx-name="my-uploader"
        pubkey="080007d48ab484634ddf"
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList="local, url, camera, dropbox"
      ></lr-config>

      <lr-file-uploader-regular
        css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.25.0/web/lr-file-uploader-regular.min.css"
        ctx-name="my-uploader"
        class="my-config"
      ></lr-file-uploader-regular>

      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePostComponent;
