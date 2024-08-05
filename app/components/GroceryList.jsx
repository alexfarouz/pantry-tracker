import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';

const GroceryList = () => {
  const { user } = useUser();
  const [groceryList, setGroceryList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [open, setOpen] = useState(false);

  const updateGroceryList = async () => {
    if (!user) return;
    const snapshot = await getDocs(collection(firestore, `users/${user.id}/grocery-list`));
    const groceryList = [];
    snapshot.forEach((doc) => {
      groceryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setGroceryList(groceryList);
  };

  const addItem = async () => {
    if (!user || !itemName || !quantity) return;
    const docRef = doc(collection(firestore, `users/${user.id}/grocery-list`), itemName.toLowerCase());
    await setDoc(docRef, { quantity: parseInt(quantity), note });
    setItemName('');
    setQuantity('');
    setNote('');
    await updateGroceryList();
    handleClose();
  };

  const removeItem = async (id) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user.id}/grocery-list`, id);
    await deleteDoc(docRef);
    await updateGroceryList();
  };

  const updateItemQuantity = async (id, quantityChange) => {
    if (!user) return;
    const docRef = doc(firestore, `users/${user.id}/grocery-list`, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const newQuantity = quantity + quantityChange;
      if (newQuantity > 0) {
        await updateDoc(docRef, { quantity: newQuantity });
        await updateGroceryList();
      } else {
        await removeItem(id);
      }
    }
  };

  useEffect(() => {
    updateGroceryList();
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-[430px] md:w-[640px] lg:w-[800px] xl:w-[1200px]">
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">Grocery List</h2>
        <hr className="mb-4" />
        <button
          onClick={handleOpen}
          className="bg-gradient-to-r from-blue-200 to-blue-300 text-black py-2 px-4 rounded hover:from-blue-300 hover:to-blue-400 w-full "
        >
          Add Grocery
        </button>
        <table className="w-full text-left border-collapse mt-4">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-gray-700 w-1/4">Item Name</th>
              <th className="px-4 py-2 text-left text-gray-700 w-1/4">Quantity</th>
              <th className="px-4 py-2 text-left text-gray-700 w-1/4">Note</th>
              <th className="px-4 py-2 text-left text-gray-700 w-1/4"></th>
            </tr>
          </thead>
          <tbody>
            {groceryList.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 text-gray-900">
                  {item.id.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </td>
                <td className="px-4 py-2 text-gray-900 flex items-center">
                  <button
                    onClick={() => updateItemQuantity(item.id, -1)}
                    className="bg-gray-700 text-white px-2 rounded-l hover:bg-gray-900"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateItemQuantity(item.id, 1)}
                    className="bg-gray-700 text-white px-2 rounded-r hover:bg-gray-900"
                  >
                    +
                  </button>
                </td>
                <td className="px-4 py-2 text-gray-900">{item.note}</td>
                <td className="px-4 py-2 text-gray-900 flex justify-end items-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal open={open} onClose={handleClose}>
          <Box position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%,-50%)'
            }}
          >
            <Typography variant="h6">Add Grocery Item</Typography>
            <Stack spacing={2}>
              <TextField
                label="Item Name"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                label="Note (optional)"
                variant="outlined"
                fullWidth
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={addItem}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default GroceryList;
