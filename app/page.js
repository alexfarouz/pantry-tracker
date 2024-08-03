'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import Sidebar from "./components/Sidebar";
import InventoryList from './components/InventoryList';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'pantry'));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    applySearch(inventoryList, searchTerm);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item.toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const applySearch = (inventoryList, term) => {
    if (term === '') {
      setFilteredInventory(inventoryList);
    } else {
      const filtered = inventoryList.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applySearch(inventory, term);
  };

  useEffect(() => {
    updateInventory();

    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 825);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased">
      <div className="fixed top-0 left-0 w-full z-20 shadow-md">
        <div className={`bg-blue-200 text-gray-700 py-4 px-8 flex items-center shadow-sm transition-all duration-300 ${isSidebarOpen && isWideScreen ? 'ml-64' : 'ml-0'}`}>
          <div className="flex items-center">
            <button
              className="p-2 bg-gray-700 text-white rounded-md mr-4"
              onClick={toggleSidebar}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            <h1 className="text-3xl font-bold">Pantry Tracker</h1>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <input
              type="text"
              placeholder="Search Pantry"
              className="w-full max-w-xs p-2 rounded border border-gray-300"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button
              className="hidden sm:block bg-gradient-to-r from-gray-500 to-gray-800 text-white py-2 px-4 rounded hover:from-gray-600 hover:to-gray-900 whitespace-nowrap"
              onClick={handleOpen}
            >
              Add New Item
            </button>
          </div>
        </div>
      </div>
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="flex flex-col items-center h-screen pt-20">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleOpen={handleOpen} />
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen && isWideScreen ? 'ml-64' : 'ml-0'}`}>
          <Box width="100vw"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
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
                <Typography variant="h6">Add Item</Typography>
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField variant='outlined'
                    fullWidth
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value)
                    }}
                  />
                  <Button variant="outlined"
                    onClick={() => {
                      addItem(itemName)
                      setItemName('')
                      handleClose()
                    }}
                  >Add</Button>
                </Stack>
              </Box>
            </Modal>

            <InventoryList inventory={filteredInventory} addItem={addItem} removeItem={removeItem} deleteItem={deleteItem} />
          </Box>
        </div>
      </div>
    </div>
  );
}
