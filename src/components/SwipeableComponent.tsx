import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ImageStack from "./ImageStack";
import { Button } from "@/components/ui/button";
import { api } from "~/utils/api";
import { supabase } from "supabaseClient.js";
//xwhmshfqmtdtneasprwx
type SwipeProps = {
  userId: string;
};

type ClothingItem = {
  id: number;
  brand: string;
  type: string;
  color: string;
  description: string;
  category: string;
  imageUrl: string;
  linkUrl: string | null;
  createdAt: Date;
};

const TinderCard = dynamic(() => import("react-tinder-card"), { ssr: false });

const SwipeableComponent: React.FC<SwipeProps> = ({ userId }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [localItemIndex, setLocalItemIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const cardRef = useRef(null);
  const recommendationAdd = api.clothingItem.addFeedback.useMutation();

  const [isMutating, setIsMutating] = useState(false);
  const { data: recommendedItems, error } =
    api.clothingItem.getRecommendedItems.useQuery({
      userId: userId,
      limit: 2500,
    });

  useEffect(() => {
    if (recommendedItems) {
      setItems((prevItems) => [...prevItems, ...recommendedItems]); // Appending new items to existing list
    }
  }, [recommendedItems]);

  const onSwipe = async (direction: string) => {
    if (isMutating) return;
    setIsMutating(true);
  
    let currentItem :any = items[localItemIndex];

    if (localItemIndex >= items.length - 1) {
      setLocalItemIndex(0);
    } else {
      setLocalItemIndex((prevIndex) => prevIndex + 1);
    }


    let feedback = "";
    if (direction === "right") {
      feedback = "like";
    } else if (direction === "left") {
      feedback = "dislike";
    }
  
    if (currentItem) {
      recommendationAdd.mutate(
        {
          userId: userId,
          clothingItemId: currentItem.id,
          feedback: feedback,
        },
        {
          onSuccess: async () => {
            try {
              if (direction === "right") {
                setLikes((prevLikes) => prevLikes + 1);
              } else if (direction === "left") {
                setDislikes((prevDislikes) => prevDislikes + 1);
              }
  
              const { data, error } = await supabase.functions.invoke("user-vector", {
                method: "POST",
                body: { userId },
              });
  
              if (error) {
                throw error;
              }
  
              console.log("Updated user feedback data:", data);
            } catch (error) {
              console.error("Failed to get updated user feedback:", error);
            } finally {
              
              setIsMutating(false);
            }
          },
          onError: () => {
            console.error("An error occurred while processing the swipe.");
            setIsMutating(false);
          },
        }
      );
    } else {
      setIsMutating(false);
    }
  };

  
  
  

  let color = "bg-" + items[localItemIndex]?.color;
  if (
    items[localItemIndex]?.color !== "white" &&
    items[localItemIndex]?.color !== "black"
  ) {
    color += "-500";
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-x-hidden overflow-y-hidden  border bg-stitched-darkGray text-white  ">
      <div className="flex justify-between ">
        <Button
          onClick={() => setLocalItemIndex((prevIndex) => prevIndex - 1)}
          disabled={localItemIndex === 0}
          className="border-none "
          variant="outline"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.20711 7.5L6.85355 3.85355ZM12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8.14645 7.14645C7.95118 7.34171 7.95118 7.65829 8.14645 7.85355L12.1464 11.8536C12.3417 12.0488 12.6583 12.0488 12.8536 11.8536C13.0488 11.6583 13.0488 11.3417 12.8536 11.1464L9.20711 7.5L12.8536 3.85355Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
        <div className={color}>
          <h1> {items[localItemIndex]?.brand}</h1>

          <h1> {items[localItemIndex]?.color}</h1>

          <h1> {items[localItemIndex]?.type}</h1>
        </div>

        {/* //small div circle to display the color of the item */}
        <div className="bg- h-8 w-8 rounded-full"></div>
        <TinderCard
          className="relative appearance-none text-center"
          ref={cardRef}
          key={localItemIndex}
          onSwipe={onSwipe}
          swipeRequirementType={"velocity"}
          preventSwipe={["up", "down"]}
        >
          {items[localItemIndex] && <ImageStack item={items[localItemIndex]} />}
          <h1> {items[localItemIndex]?.description}</h1>
        </TinderCard>

        <Button
          onClick={() => setLocalItemIndex((prevIndex) => prevIndex + 1)}
          className="border-none"
          variant="outline"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>

        <div className="absolute bottom-5 left-5">
          <p className="mb-1">Likes: {likes}</p>
          <p>Dislikes: {dislikes}</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeableComponent;
