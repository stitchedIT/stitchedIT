import { useEffect } from "react";
import Image from "next/image";

interface ClothingItem {
  id: number;
  brand: string;
  type: string;
  color: string;
  description: string;
  category: string;
  imageUrl: string;
  linkUrl: string | null;
  createdAt: Date;
}

interface ImageStackProps {
  item: ClothingItem;
}

const ImageStack: React.FC<ImageStackProps> = ({ item }) => {
  if (!item) {
    return null;
  }

  return (
    <div>
      <Image
        width={600}
        height={300}
        draggable={false}
        src={item.imageUrl}
        alt={item.description}
      />
    </div>
  );
};

export default ImageStack;
