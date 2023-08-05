import { useState, useRef, useEffect } from "react";
import ImageStack from "./ImageStack";

function SwipeableComponent() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [TinderCard, setTinderCard] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    import('react-tinder-card').then((TinderCardModule) => {
      setTinderCard(() => TinderCardModule.default);
    });
  }, []);

  const onSwipe = (direction: string) => {
    console.log("You swiped: " + direction);
    if (direction === "right") {
      setLikes((prevLikes) => prevLikes + 1);
    } else if (direction === "left") {
      setDislikes((prevDislikes) => prevDislikes + 1);
    }
    setImageIndex((prevIndex) => prevIndex + 1);
  };

  const onCardLeftScreen = (myIdentifier: string) => {
    console.log(myIdentifier + " left the screen");
  };

  const handleNextImage = () => {
    setImageIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevImage = () => {
    setImageIndex((prevIndex) => prevIndex - 1);
  };

  if (!TinderCard) return null; // render nothing if TinderCard is not loaded yet

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
