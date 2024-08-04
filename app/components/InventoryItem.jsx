import { useEffect, useState } from 'react';
import { Button, Typography, Box, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import fetchImage from '../utils/fetchImage';

const InventoryItem = ({ name, quantity, addItem, removeItem, deleteItem }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getImage = async () => {
      const image = await fetchImage(name);
      console.log(`Image URL for ${name}: ${image}`);
      setImageUrl(image);
    };

    getImage();
  }, [name]);

  return (
    <Box className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-32 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded-md mb-4">
          <Typography variant="h6" color="textSecondary">Loading...</Typography>
        </div>
      )}
      <Typography variant="h5" color="textPrimary">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>
      <Typography variant="h6" color="textSecondary" className="mb-2">
        Quantity: {quantity}
      </Typography>
      <Box className="flex space-x-2 mb-4">
        <IconButton color="primary" onClick={() => addItem(name)}>
          <AddIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => removeItem(name)}>
          <RemoveIcon />
        </IconButton>
      </Box>
      <button
        className="bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 
            text-white py-2 px-4 rounded mt-4 hover:from-blue-400 hover:via-blue-600 hover:to-blue-400"
        onClick={() => deleteItem(name)}
      >
        Remove
      </button>
    </Box>
  );
};

export default InventoryItem;
