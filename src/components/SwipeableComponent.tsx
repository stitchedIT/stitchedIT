import { useState, useEffect,useRef } from "react";
import dynamic from "next/dynamic";
import ImageStack from "./ImageStack";
import React from "react";

const TinderCard = dynamic(() => import("react-tinder-card"), { ssr: false });

function SwipeableComponent() {
  const [imageIndex, setImageIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [TinderCardLoaded, setTinderCardLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setTinderCardLoaded(true);
  }, []);

  const handleNextImage = () => {
    setImageIndex((prevIndex) => prevIndex + 1);
  };

  const onSwipe = (direction: string) => {
    if (direction === "right") {
      setLikes((prevLikes) => prevLikes + 1);
    } else if (direction === "left") {
      setDislikes((prevDislikes) => prevDislikes + 1);
    }
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  const handlePrevImage = () => {
    setImageIndex((prevIndex) => prevIndex - 1);
  };

  if (!TinderCardLoaded) return null; // render nothing if TinderCard is not loaded yet

  return (
    <div className="text-white">
      <div className="stats">
        <p>Likes: {likes}</p>
        <p>Dislikes: {dislikes}</p>
      </div>
      <div className="item-showcase">
        <TinderCard
          ref={cardRef}
          key={imageIndex}
          onSwipe={onSwipe}
          onCardLeftScreen={() => onCardLeftScreen("item-card")}
          preventSwipe={["up", "down"]}
        >
          <ImageStack imageIndex={imageIndex} />
        </TinderCard>
        <div>
          <button onClick={handlePrevImage} disabled={imageIndex === 0}>
            Previous Image
          </button>
          <button onClick={handleNextImage}>Next Image</button>
        </div>
      </div>
    </div>
  );
}

export default SwipeableComponent;