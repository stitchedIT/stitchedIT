import { useState, useEffect } from "react";
import Image from "next/image";
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";

interface ImageData {
  name: string;
  path: string;
}

interface ImageStackProps {
  imageIndex: number;
}

const ImageStack = ({ imageIndex }: ImageStackProps) => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const blobServiceClient = new BlobServiceClient(
          `https://imagesitems.blob.core.windows.net/`,
          new AnonymousCredential()
        );
  
        const containerClient = blobServiceClient.getContainerClient("images");
  
        let images = [];
        for await (const blob of containerClient.listBlobsFlat()) {
          // Only push blobs that have a .png extension
          if (blob.name.toLowerCase().endsWith('.png')) {
            images.push({ name: blob.name, path: blob.name });
          }
        }
  
        setImageData(images);
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

  const imageName = imageData[imageIndex]?.name || '';

  return (
    <div>
      <p>{imageName.split(".")[0]}</p>
      
      <Image
        width={300 }
        height={300}
        draggable={false}
        src={`https://imagesitems.blob.core.windows.net/images/${imageName}`}
        alt="stacked image"
      />
    </div>
  );
};

export default ImageStack;