import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageData {
  name: string;
}

interface ImageStackProps {
  imageIndex: number;
}

const ImageStack = ({ imageIndex }: ImageStackProps) => {
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/ThyDrSlen/orwell-scraper/contents/shoes"
        );
        const data: ImageData[] = (await response.json()) as ImageData[];
        const imageNames = data.map((item) => item.name);
        setImageNames(imageNames);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImages().catch((error) => console.log(error));
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>{imageNames[imageIndex]?.split(".")[0]}</p>
      <Image
        width={275}
        height={275}
        draggable={false}
        src={`https://raw.githubusercontent.com/ThyDrSlen/orwell-scraper/main/shoes/${imageNames[imageIndex]}`}
        alt="stacked image"
      />
    </div>
  );
};

export default ImageStack;