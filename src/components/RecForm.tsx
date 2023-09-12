import { validateConfig } from "next/dist/server/config-shared";
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
  { value: "Black", label: "Black" },
  { value: "White", label: "White" },
  { value: "Green", label: "Green" },
  { value: "Yellow", label: "Yellow" },
  { value: "Orange", label: "Orange" },
  { value: "Purple", label: "Purple" },
  { value: "Brown", label: "Brown" },
  { value: "Grey", label: "Grey" },
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
