import React, { useState } from "react";
import { api } from "~/utils/api";
import {supabase} from "supabaseClient.js";

type FormData = {
  userId: string;
  favColor: string;
  favBrand: string;
//   brandTags: string;
//   imageUrl: string;
};

type Props = {
  userId: string;
};

function RecFormComponent({ userId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    favColor: "black",
    favBrand: "Supreme",
  });

  const makeRecData = api.recdata.addRecData.useMutation();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    formData.userId = userId || "";
    console.log("formData",formData)

    // const tagsArray = formData.brandTags.split(",").map((tag) => tag.trim());

    makeRecData.mutate({
      ...formData,
    //   brandTags: tagsArray,
    });
  };
  return (
    <form onSubmit={handleSubmit} className="bg-stitched-sand  p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-2">
    <div className="mt-4">
        <p>What is your favorite color?</p>
        <select value={formData.favColor} onChange={(e) =>
          setFormData((prev) => ({ ...prev,favColor: e.target.value }))
        }>
            <option value="Black">Black</option>
            <option value="Red">Red</option>
            <option value="Pink">Pink</option>
            <option value="Blue">Blue</option>
        </select>
      </div>
      <div className="mt-4">
        <p>What is your favorite brand?</p>
        <select value={formData.favBrand} onChange={(e) =>
          setFormData((prev) => ({ ...prev,favBrand: e.target.value }))
        }>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option selected value="Supreme">Supreme</option>
            <option value="newBalance">New Balance</option>
        </select>
      </div>

      <button type="submit" className="mt-6 bg-stitched-pink text-stitched-darkGray px-6 py-2 rounded-md hover:bg-stitched-lightPink focus:outline-none">
        Submit Prefrences
      </button>
    </form>
  );
}

export default RecFormComponent;