import { useState, useEffect } from "react";
import Image from "next/image";
import { BlobServiceClient, AnonymousCredential } from "@azure/storage-blob";

interface ImageData {
  name: string;
  path: string;
}
interface ImageStackProps {
  imageIndex: number;
  onImageNameChange: (imageName: string) => void; // Add this line
}


const BATCH_SIZE = 10;

const ImageStack = ({ imageIndex, onImageNameChange }: ImageStackProps) => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

  const fetchImages = async (startFrom: number) => {
    try {
        const blobServiceClient = new BlobServiceClient(
            `https://imagesitems.blob.core.windows.net/`,
            new AnonymousCredential()
        );

        const containerClient = blobServiceClient.getContainerClient("images");
        const blobItems = containerClient.listBlobsFlat({ prefix: '' });
        
        let count = 0;
        const imagePromises: string[] = [];

        for await (const blob of blobItems) {
            if (count++ < startFrom) continue;

            if (blob.name.toLowerCase().endsWith('.png')) {
                imagePromises.push(blob.name);
            }

            if (imagePromises.length >= BATCH_SIZE) break;
        }

        const images = await Promise.all(imagePromises);

        setImageData(prevData => [...prevData, ...images.map(name => ({ name, path: name }))]);
        setIsLoading(false);
    } catch (error) {
        console.error(error);
    }
};


  useEffect(() => {
    fetchImages(0);
  }, []);

  

  useEffect(() => {
    if (imageIndex >= (currentBatchIndex + 1) * BATCH_SIZE - 5) {
      setCurrentBatchIndex(prev => prev + 1);
      fetchImages((currentBatchIndex + 1) * BATCH_SIZE);
    }
  }, [imageIndex]);

  const imageDataItem = imageData[imageIndex];
  const imageName = imageDataItem?.name;
  useEffect(() => {
    if (imageName) {
        onImageNameChange(imageName);
    }
  }, [imageName]);
  console.log(imageName);
  return (
    <div>
      {imageName && <p>{imageName.split(".")[0]}</p>}
      <Image
        width={300}
        height={300}
        draggable={false}
        src={`https://imagesitems.blob.core.windows.net/images/${imageName}`}
        alt="stacked image"
      />
    </div>
  );
};


export default ImageStack;