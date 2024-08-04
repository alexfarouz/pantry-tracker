import { useRef } from 'react';
import { Camera } from 'react-camera-pro';
import { storage } from '@/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const CameraCapture = ({ onCapture, onClose }) => {
  const camera = useRef(null);

  const takePicture = async () => {
    try {
      const photo = camera.current.takePhoto();
      console.log("Photo captured:", photo);

      // Create a reference to the storage location
      const storageRef = ref(storage, `images/${Date.now()}.jpg`);

      // Upload the image as a base64 string
      await uploadString(storageRef, photo, 'data_url');
      console.log("Photo uploaded to storage");

      // Get the download URL
      const url = await getDownloadURL(storageRef);
      console.log("Download URL:", url);

      // Pass the URL to the parent component or backend for processing
      onCapture(url);

      // Close the camera modal
      onClose();
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Camera ref={camera} aspectRatio={16 / 9} className="w-full h-full" />
      <button
        className="absolute bottom-10 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        onClick={takePicture}
      >
        Capture
      </button>
    </div>
  );
};

export default CameraCapture;
