import React from 'react';
import InventoryItem from './InventoryItem';
import { Box } from '@mui/material';

const InventoryList = ({ inventory, addItem, removeItem, deleteItem }) => {
  return (
    <Box className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {inventory.map(item => (
        <InventoryItem key={item.name} {...item} addItem={addItem} removeItem={removeItem} deleteItem={deleteItem} />
      ))}
    </Box>
  );
};

export default InventoryList;
