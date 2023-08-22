import React, { useState } from 'react';
import { api } from "~/utils/api"; 
import { GetServerSideProps } from 'next';
import { getAuth, buildClerkProps } from '@clerk/nextjs/server';

type FormData = {
  userId: string;
  description?: string;
  brandTags: string[];
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
        destination: '/login',
        permanent: false,
      },
    };
  }
 
  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req), userId } };
};

function CreatePostComponent({ userId }: Props) {
  
  const [formData, setFormData] = useState<FormData>({
    userId: '',
    description: undefined,
    brandTags: [],
    imageUrl: '',
  });
  
  const [tag, setTag] = useState('');

  const createPost = api.post.addPost.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("session", userId)
    formData.userId = userId || '';
    createPost.mutate(formData);
    // console.log(formData);
  };

  const handleAddTag = () => {
    if (tag) {
      setFormData(prev => ({ ...prev, brandTags: [...prev.brandTags, tag] }));
      setTag('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      
      <textarea 
        value={formData.description}
        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        placeholder="Description"
      />

      <div>
        <input
          value={tag}
          onChange={e => setTag(e.target.value)}
          placeholder="Add a brand tag"
        />
        <button type="button" onClick={handleAddTag}>Add Tag</button>
        <div>
          {formData.brandTags.map((t, index) => <span key={index}>{t} </span>)}
        </div>
      </div>

      <input 
        value={formData.imageUrl}
        onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
        placeholder="Image URL"
      />
  
      <button type="submit">Create Post</button>
    </form>
  )
}

export default CreatePostComponent;