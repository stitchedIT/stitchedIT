import { useState, useEffect } from "react";

interface ImageStackProps {
  imageIndex: number;
}

const ImageStack = ({ imageIndex }: ImageStackProps) => {
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(
        "https://api.github.com/repos/ThyDrSlen/orwell-scraper/contents/shoes"
      );
      const data = await response.json();
      const imageNames = data.map((item: any) => item.name);
      setImageNames(imageNames);
      setIsLoading(false);
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>{imageNames[imageIndex]?.split(".")[0]}</p>
      <img width="275px"
        draggable="false"
        src={`https://raw.githubusercontent.com/ThyDrSlen/orwell-scraper/main/shoes/${imageNames[imageIndex]}`}
        alt="stacked image"
      />
    </div>
  );
};

export default ImageStack;