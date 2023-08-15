import React, { useState } from 'react';
import { api } from "~/utils/api"; 
import { useSession } from 'next-auth/react';
function CreatePostComponent() {
    
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

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  
};

  const handleAddTag = () => {
    if (tag) {
      setFormData(prev => ({ ...prev, brandTags: [...prev.brandTags, tag] }));
      setTag('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.userId}
        onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
        placeholder="User ID"
      />
      
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
