import React from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { api } from "~/utils/api";

type RecommendationMatrixProps = {
  userId: string;
};

type ItemProps = {
  imageUrl: string;
};

type Product = {
  brand: string;
  color: string;
  imageUrl: string;
};

const Item: React.FC<ItemProps> = ({ imageUrl }) => {
  return (
    <div className="group relative">
      <img
        src={imageUrl}
        alt="Clothing item"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition group-hover:opacity-100">
        <button className="mr-2 rounded bg-green-500 p-2">Like</button>
        <button className="ml-2 rounded bg-red-500 p-2">Dislike</button>
      </div>
    </div>
  );
};

function RecommendationMatrix({ userId }: RecommendationMatrixProps) {
  const reccData = api.recdata.getItemsArray.useQuery({ userId: userId });
  const reccPreferences = api.recdata.getBrandsArray.useQuery({
    userId: userId,
  });

  // Check if data is still being loaded
  if (reccData.isLoading || reccPreferences.isLoading) {
    return <div>Loading...</div>; // Return a loading state
  }

  // Check if there was an error loading the data
  if (reccData.isError || reccPreferences.isError) {
    return <div>Error loading data</div>; // Return an error state
  }

  const placeholderImageUrl =
    "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";

  const data = reccData?.data || [];

  // Initialize a 3x3 matrix with placeholder data
  const matrix = Array(3)
    .fill(null)
    .map(() => Array(3).fill({ imageUrl: placeholderImageUrl }));

  // Define the brand and color mapping to index
  const brandMapping = reccPreferences.data[0]?.favBrand;
  const colorMapping = reccPreferences.data[0]?.favColor;

  // To keep track of filled cells
  const filledCells = Array(3)
    .fill(null)
    .map(() => Array(3).fill(false));

  // Populate the matrix with the actual data based on the brand and color mapping
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const brandIndex = brandMapping.indexOf(item.brand);
    const colorIndex = colorMapping.indexOf(item.color);

    if (
      brandIndex !== -1 &&
      colorIndex !== -1 &&
      !filledCells[brandIndex][colorIndex]
    ) {
      matrix[brandIndex][colorIndex] = item;
      filledCells[brandIndex][colorIndex] = true;
    }

    // Check if all cells are filled
    if (filledCells.flat().every((cell) => cell)) {
      break;
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {matrix.map((row, rowIndex) =>
        row.map((item, colIndex) => (
          <Item key={`${rowIndex}-${colIndex}`} imageUrl={item.imageUrl} />
        ))
      )}
    </div>
  );
}

export default RecommendationMatrix;
