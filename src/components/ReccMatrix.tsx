import React, { useCallback, useState, useEffect } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { api } from "~/utils/api";
import { supabase } from "supabaseClient.js";

type RecommendationMatrixProps = {
  userId: string;
};

type ItemProps = {
  imageUrl: string;
};

type Product = {
  id: string;
  brand: string;
  color: string;
  imageUrl: string;
};

const placeholderImageUrl =
  "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";

const Item: React.FC<
  ItemProps & { onLike: () => void; onDislike: () => void }
> = ({ imageUrl, onLike, onDislike }) => {
  return (
    <div className="group relative">
      <img
        src={imageUrl}
        alt="Clothing item"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition group-hover:opacity-100">
        <button onClick={onLike} className="mr-2 rounded bg-green-500 p-2">
          Like
        </button>
        <button onClick={onDislike} className="ml-2 rounded bg-red-500 p-2">
          Dislike
        </button>
      </div>
    </div>
  );
};

function RecommendationMatrix({ userId }: RecommendationMatrixProps) {
  const reccData = api.recdata.getItemsArray.useQuery({ userId });
  const reccPreferences = api.recdata.getBrandsArray.useQuery({ userId });
  const feedbackAdd = api.clothingItem.addFeedback.useMutation();
  const [likeCount, setLikeCount] = useState(0);
  const [viewedItemIDs, setViewedItemIDs] = useState<Set<string>>(new Set());
  const [matrix, setMatrix] = useState<Product[][]>(
    Array(3)
      .fill(null)
      .map(() =>
        Array(3).fill({
          imageUrl: placeholderImageUrl,
          id: "",
          brand: "",
          color: "",
        })
      )
  );

  const brandMapping = reccPreferences.data?.[0]?.favBrand || [];
  const colorMapping = reccPreferences.data?.[0]?.favColor || [];

  useEffect(() => {
    if (reccData.isSuccess && reccPreferences.isSuccess) {
      const data = reccData.data || [];

      const filledCells = Array(3)
        .fill(null)
        .map(() => Array(3).fill(false));

      const newMatrix = Array(3)
        .fill(null)
        .map(() =>
          Array(3).fill({
            imageUrl: placeholderImageUrl,
            id: "",
            brand: "",
            color: "",
          })
        );

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const brandIndex = brandMapping.indexOf(item.brand);
        const colorIndex = colorMapping.indexOf(item.color);

        if (
          brandIndex !== -1 &&
          colorIndex !== -1 &&
          !filledCells[brandIndex][colorIndex]
        ) {
          newMatrix[brandIndex][colorIndex] = item;
          filledCells[brandIndex][colorIndex] = true;
        }

        if (filledCells.flat().every((cell) => cell)) {
          break;
        }
      }

      setMatrix(newMatrix);
    }
  }, [reccData.isSuccess, reccPreferences.isSuccess]);

  const findNextItem = useCallback(
    (rowIndex: number, colIndex: number) => {
      // Step 1: Filter out items that the user has already viewed
      const unseenItems = reccData.data.filter(
        (item) => !viewedItemIDs.has(item.id)
      );

      // Step 2: Sort the remaining items based on the user's preferences
      const sortedItems = unseenItems.sort((a, b) => {
        const brandIndexA = brandMapping.indexOf(a.brand);
        const colorIndexA = colorMapping.indexOf(a.color);
        const brandIndexB = brandMapping.indexOf(b.brand);
        const colorIndexB = colorMapping.indexOf(b.color);

        // Implement your sorting logic here
        // (this is just a basic example, you'll need to elaborate on this)
        return brandIndexA - brandIndexB || colorIndexA - colorIndexB;
      });

      // Step 3: Take the first item from the sorted list to be the next item
      const nextItem = sortedItems[0];

      return nextItem;
    },
    [reccData, reccPreferences, viewedItemIDs]
  );


  const handleFeedback = useCallback(
    async (rowIndex: number, colIndex: number, feedbackResult: string) => {
      const currentItem = reccData.data?.find(
        (item) => item.id === matrix[rowIndex][colIndex].id
      );

      if (!currentItem) {
        console.error("No current item found at the specified indices");
        return;
      }

      
      

      feedbackAdd.mutate({
        userId,
        clothingItemId: currentItem.id,
        feedback: feedbackResult,
      });

      try {
        const { data, error } = await supabase.functions.invoke(
        "user-vector",
        {
          method: "POST",
          body: { userId },
        }
      );
      if (error) {
        throw error;
      }
      console.log(data,"recc data")
      
      // console.log(data,"data")
      }
      catch(error){
        console.error("Failed to get updated user rec:", error);
      }

      
      

      const nextItem = findNextItem(rowIndex, colIndex);
      if (nextItem) {
        // Here we properly update the matrix using the setMatrix function
        setMatrix((prevMatrix) => {
          const newMatrix = [...prevMatrix];
          newMatrix[rowIndex][colIndex] = nextItem;
          return newMatrix;
        });
        setViewedItemIDs((prev) => new Set(prev).add(nextItem.id));
      }
      if (feedbackResult === "like" && likeCount < 10) {
        setLikeCount((prev) => prev + 1);
      }
    },
    [reccData.data, findNextItem, feedbackAdd, matrix, userId, likeCount]
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {matrix.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Item
            key={`${rowIndex}-${colIndex}`}
            imageUrl={cell.imageUrl}
            onLike={() => handleFeedback(rowIndex, colIndex, "like")}
            onDislike={() => handleFeedback(rowIndex, colIndex, "dislike")}
          />
        ))
      )}
    </div>
  );
}

export default RecommendationMatrix;
