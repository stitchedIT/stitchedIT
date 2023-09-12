import React from "react";

type RecommendationMatrixProps = {
  userId: string;
};

type ItemProps = {
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
  // TODO: Replace with actual data
  const data = Array(9).fill({
    imageUrl:
      "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg",
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((item, index) => (
        <Item key={index} imageUrl={item.imageUrl} />
      ))}
    </div>
  );
}

export default RecommendationMatrix;
