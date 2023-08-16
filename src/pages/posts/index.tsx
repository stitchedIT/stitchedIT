import React, { useState } from 'react';
import { api } from "~/utils/api"; 
import { useSession } from 'next-auth/react';
function CreatePostComponent() {
  
  const { data: sessionData } = useSession();


  type FormData = {
    userId: string;
    description?: string;
    brandTags: string[];
    imageUrl: string;
  };

  
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
  console.log("session", sessionData?.user?.id)
  formData.userId = sessionData?.user?.id || '';
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
