import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import React from "react";
import ImageStack from "./ImageStack";
import { Button } from "@/components/ui/button";
import { api } from "~/utils/api";

type SwipeProps = {
  userId: string | undefined;
};

const TinderCard = dynamic(() => import("react-tinder-card"), { ssr: false });

// function SwipeableComponent(userId: Props) {
const SwipeableComponent: React.FC<SwipeProps> = ({ userId }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [TinderCardLoaded, setTinderCardLoaded] = useState(false);
  const cardRef = useRef(null);
  const [currentImageName, setCurrentImageName] = useState<string>("");

  useEffect(() => {
    setTinderCardLoaded(true);
  }, []);

  const handleNextImage = () => {
    setImageIndex((prevIndex) => prevIndex + 1);
  };
  const handleImageNameChange = (imageName: string) => {
    setCurrentImageName(imageName);
    const clothingItemData = extractPropertiesFromImageName(imageName);
    // Use clothingItemData as needed, e.g., in the onSwipe function
  };
  function extractPropertiesFromImageName(imageName: string) {
    if (!imageName) {
      console.error("Image name is undefined");
      return null;
    }

    const segments = imageName.split("/");

    if (segments.length !== 5) {
      console.error("Unexpected imageName format:", imageName);
      return null;
    }

    const brand = segments[0];
    const type = segments[1];
    const category = segments[2];
    const color = segments[3];
    const description = segments[4]?.split(".")[0]; // Removing the .png extension

    return {
      brand,
      type,
      category,
      color,
      description,
    };
  }

  const recommendationAdd = api.clothingItem.addRecommendation.useMutation();
  const addClothingItem = api.clothingItem.addClothingItem.useMutation();
  const checkExistingClothingItem = api.clothingItem.getItemByImageURL.useQuery();

  const onSwipe = (direction: string) => {
    let feedback = "";
    if (direction === "right") {
      setLikes((prevLikes) => prevLikes + 1);
      feedback = "like";
    } else if (direction === "left") {
      setDislikes((prevDislikes) => prevDislikes + 1);
      feedback = "dislike";
    }
  
    const actualUserId = userId?.userId;
  
    if (actualUserId && typeof actualUserId === "string") {
      // Extract properties from the current image name
      const clothingItemData: any =
        extractPropertiesFromImageName(currentImageName);
  
      if (clothingItemData) {
        // Call the tRPC procedure to check if a clothing item with the same image URL already exists
        checkExistingClothingItem
          .query({
            imageUrl: `https://imagesitems.blob.core.windows.net/images/${currentImageName}`,
          })
          .then((existingClothingItem) => {
            if (existingClothingItem) {
              // If the clothing item already exists, add a recommendation
              recommendationAdd.mutate({
                userId: actualUserId,
                clothingItemId: existingClothingItem.id,
                feedback: feedback,
              });
            } else {
              // If the clothing item doesn't exist, call the tRPC procedure to add a new clothing item
              addClothingItem.mutate(
                {
                  brand: clothingItemData.brand,
                  type: clothingItemData.type,
                  color: clothingItemData.color,
                  description: clothingItemData.description,
                  imageUrl: `https://imagesitems.blob.core.windows.net/images/${currentImageName}`,
                },
                {
                  onSuccess: (data) => {
                    // If the clothing item was added successfully, add a recommendation
                    recommendationAdd.mutate({
                      userId: actualUserId,
                      clothingItemId: data.id,
                      feedback: feedback,
                    });
                  },
                  onError: (error) => {
                    console.error("Error adding clothing item:", error);
                  },
                }
              );
            }
          })
          .catch((error) => {
            console.error("Error checking for existing clothing item:", error);
          });
      }
    } else {
      console.error("Unable to extract userId:", userId);
    }
  };
  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
    handleNextImage(); // Simulate a click on the next button
  };

  const handlePrevImage = () => {
    setImageIndex((prevIndex: number) => prevIndex - 1);
  };

  if (!TinderCardLoaded) return null; // render nothing if TinderCard is not loaded yet

  return (
    <div className="flex h-screen items-center justify-center overflow-x-hidden overflow-y-hidden  border bg-stitched-black text-white ">
      <div className="flex justify-between ">
        <Button
          onClick={handlePrevImage}
          disabled={imageIndex === 0}
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
              d="M6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.20711 7.5L6.85355 3.85355ZM12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8.14645 7.14645C7.95118 7.34171 7.95118 7.65829 8.14645 7.85355L12.1464 11.8536C12.3417 12.0488 12.6583 12.0488 12.8536 11.8536C13.0488 11.6583 13.0488 11.3417 12.8536 11.1464L9.20711 7.5L12.8536 3.85355Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Button>

        {/* Swipeable Image */}
        <TinderCard
          className="relative  appearance-none text-center"
          ref={cardRef}
          key={imageIndex}
          onSwipe={onSwipe}
          onCardLeftScreen={() => onCardLeftScreen("item-card")}
          preventSwipe={["up", "down"]}
        >
          <ImageStack
            imageIndex={imageIndex}
            onImageNameChange={handleImageNameChange}
          />
        </TinderCard>

        <Button
          onClick={handleNextImage}
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
              fill-rule="evenodd"
              clip-rule="evenodd"
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
