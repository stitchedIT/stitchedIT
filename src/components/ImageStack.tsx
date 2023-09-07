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
        width={500}
        height={250}
        style={{ maxWidth: 900, maxHeight: 700 }}
        placeholder="blur"
        blurDataURL={"/00.png"}
        draggable={false}
        src={item.imageUrl}
        alt={item.description}
      />
    </div>
  );
};

export default ImageStack;
