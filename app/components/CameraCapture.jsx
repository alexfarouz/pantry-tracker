import { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
import { storage } from '@/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { CameraIcon, ArrowPathIcon } from '@heroicons/react/24/solid'; // Import icons

const CameraCapture = ({ onCapture, onClose }) => {
  const camera = useRef(null);
  const [isBackCamera, setIsBackCamera] = useState(true);

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

  const flipCamera = () => {
    setIsBackCamera(!isBackCamera);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Camera
        ref={camera}
        aspectRatio={window.innerWidth >= 825 ? 16 / 9 : 9 / 16}
        numberOfCamerasCallback={(num) => console.log(`Number of cameras detected: ${num}`)}
        facingMode={isBackCamera ? 'environment' : 'user'}
        className="w-full h-full"
      />
      <div className="absolute bottom-10 flex space-x-4">
        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 flex items-center justify-center"
          onClick={takePicture}
        >
          <CameraIcon className="w-6 h-6" />
        </button>
        <button
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 flex items-center justify-center"
          onClick={flipCamera}
        >
          <ArrowPathIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
