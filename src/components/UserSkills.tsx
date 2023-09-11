import React, { useState } from "react";
import Select from "react-select";
import { api } from "~/utils/api";

type FormData = {
  userId: string;
  favColor: string; 
  favBrand: string;
};

const colorOptions = [
  { value: "Blue", label: "Blue" },
  { value: "Red", label: "Red" },
  { value: "Pink", label: "Pink" },
  { value: "Black", label: "Black" }
];

const brandOptions = [
  { value: "Supreme", label: "Supreme" },
  { value: "Nike", label: "Nike" },
  { value: "Adidas", label: "Adidas" },
  { value: "New Balance", label: "New Balance" }
];

type Props = {
  userId: string;
};

function UserSkills({ userId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    userId: userId || "",
    favColor: "",
    favBrand: "" 
  });

  const makeRecData = api.recdata.addRecData.useMutation();

  const handleColorChange = (selectedOptions) => {
    const selectedColors = selectedOptions.map(option => option.value);
    setFormData(prev => ({ ...prev, favColor: selectedColors }));
  };

  const handleBrandChange = (selectedOptions) => {
    const selectedBrands = selectedOptions.map(option => option.value);
    setFormData(prev => ({ ...prev, favBrand: selectedBrands }));;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    formData.userId = userId || "";
    console.log(formData)
  
    makeRecData.mutate({
      ...formData,
      favColor: formData.favColor,
      favBrand: formData.favBrand
    })
  };
  
  
  return (
    <>
      <h2 className="mt-6 bg-stitched-pink text-stitched-darkGray">Please select all your preferences</h2>
      <form onSubmit={handleSubmit}>
        <Select 
          options={colorOptions}
          value={colorOptions.filter(option => formData.favColor.includes(option.value))}
          onChange={handleColorChange}
          isMulti
          closeMenuOnSelect={false}
        />
        <Select
           options={brandOptions}
           value={brandOptions.filter(option => formData.favBrand.includes(option.value))}
          onChange={handleBrandChange}
          isMulti
          closeMenuOnSelect={false}
        />
        <button type="submit" className="mt-6 bg-stitched-pink text-stitched-darkGray px-6 py-2 rounded-md hover:bg-stitched-lightPink focus:outline-none">Submit Preferences</button>
      </form>
    </>
  );
}

export default UserSkills;
