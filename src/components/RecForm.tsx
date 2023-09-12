import React, { useState } from "react";
import Select from "react-select";
import { api } from "~/utils/api";

type FormData = {
  userId: string;
  favColor: string;
  favBrand: string;
};

const colorOptions = [
  
  { value: "blue", label: "Blue" },
  { value: "red", label: "Red" },
  { value: "pink", label: "Pink" },
  { value: "black", label: "Black"},
  { value: "white", label: "White" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "orange", label: "Orange" },
  { value: "purple", label: "Purple" },
  { value: "brown", label: "Brown" },
  { value: "grey", label: "Grey" },
];

const brandOptions = [
  { value: "Supreme", label: "Supreme" },
  { value: "Nike", label: "Nike" },
  { value: "Adidas", label: "Adidas" },
  { value: "New Balance", label: "New Balance" },
  { value: "Essentials", label: "Essentials" },
  { value: "Gucci", label: "Gucci" },
  { value: "Saint Laurent", label: "Saint Laurent" },
  { value: "Jordans", label: "Jordans" },
  { value: "Bape", label: "Bape" },
  { value: "Billionaire Boys Club", label: "Billionaire Boys Club" },
  { value: "Carhartt", label: "Carhartt" },
  { value: "Kith", label: "Kith" },
  { value: "Neighborhood", label: "Neighborhood" },
  { value: "Off White", label: "Off White" },
  { value: "Ralph Lauren", label: "Ralph Lauren" },
  { value: "Stone Island", label: "Stone Island" },
  { value: "Stussy", label: "Stussy" },
  { value: "Yeezy", label: "Yeezy" },
  { value: "Vlone", label: "Vlone" },
  { value: "Y 3", label: "Y 3" },
  { value: "Vetements", label: "Vetements" },
];

type Props = {
  userId: string;
};

function RecDataFormComponent({ userId }: Props) {
  const [formData, setFormData] = useState<FormData>({
    userId: userId || "",
    favColor: "",
    favBrand: "",
  });

  const [error, setError] = useState<string | null>(null);
  const makeRecData = api.recdata.addRecData.useMutation();
  const arri = api.recdata.getItemsArray.useQuery({userId: userId});
  console.log("hey jason this is for the whole array",arri.data)
  //example arri.data?[i] where i could be mapped
  //to get the image url arr.data?[i].imageUrl

  const handleColorChange = (selectedOptions) => {
    const selectedColors = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({ ...prev, favColor: selectedColors }));
    if (selectedColors.length !== 3) {
      setError("You must select exactly 3 colors. Try again.");
    } else {
      setError(null);
    }
  };

  const handleBrandChange = (selectedOptions) => {
    const selectedBrands = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({ ...prev, favBrand: selectedBrands }));
    if (selectedBrands.length !== 3) {
      setError("You must select exactly 3 brands");
    } else {
      setError(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.favColor.length !== 3 || formData.favBrand.length !== 3) {
      setError("Please select exactly 3 options in each category. try again.");
      return;
    }

    formData.userId = userId || "";
    console.log(formData);

    makeRecData.mutate({
      ...formData,
      favColor: formData.favColor,
      favBrand: formData.favBrand,
    });
  };

  return (
    <>
      <h2 className="mt-6 bg-stitched-pink text-stitched-darkGray">
        Please select all your preferences
      </h2>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <Select
          options={colorOptions}
          value={colorOptions.filter((option) =>
            formData.favColor.includes(option.value)
          )}
          onChange={handleColorChange}
          isMulti
          closeMenuOnSelect={false}
        />
        <Select
          options={brandOptions}
          value={brandOptions.filter((option) =>
            formData.favBrand.includes(option.value)
          )}
          onChange={handleBrandChange}
          isMulti
          closeMenuOnSelect={false}
        />
        <button
          type="submit"
          className="mt-6 rounded-md bg-stitched-pink px-6 py-2 text-stitched-darkGray hover:bg-stitched-lightPink focus:outline-none"
        >
          Submit Preferences
        </button>
      </form>
    </>
  );
}

export default RecDataFormComponent;
