'use client';
import { useState, useEffect, useRef } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import Sidebar from "./components/Sidebar";
import InventoryList from './components/InventoryList';
import CameraCapture from './components/CameraCapture';
import LoadingBar from './components/LoadingBar';
import { SignedIn, SignedOut, SignIn, useUser, UserButton } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signInPopupRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const updateInventory = async () => {
    if (!user) return;
    const snapshot = await getDocs(collection(firestore, `users/${user.id}/pantry`));
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
    if (!user) return;
    const docRef = doc(collection(firestore, `users/${user.id}/pantry`), item.toLowerCase());
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
    if (!user) return;
    const docRef = doc(collection(firestore, `users/${user.id}/pantry`), item);
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
    if (!user) return;
    const docRef = doc(collection(firestore, `users/${user.id}/pantry`), item);
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
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenCamera = () => setIsCameraOpen(true);
  const handleCloseCamera = () => setIsCameraOpen(false);

  const handleCapture = async (url) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/AnalyzeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });
      const data = await response.json();
      if (data.item && data.quantity) {
        await addItem(data.item, data.quantity);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
    setIsLoading(false);
    setIsCameraOpen(false);
    updateInventory();
  };

  useEffect(() => {
    if (!user && signInPopupRef.current) {
      signInPopupRef.current.click();
    }
  }, [user]);

  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased">
      <SignedOut>
        <div className="h-screen flex items-center justify-center">
          <div ref={signInPopupRef}>
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        {isLoading && <LoadingBar duration={3000} />}
        {!isLoading && (
          <>
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
                  <h1 className="text-3xl font-bold hidden sm:block">Pantry Tracker</h1>
                </div>
                <div className="flex items-center space-x-4 ml-auto">
                  <input
                    type="text"
                    placeholder="Search Pantry"
                    className="w-full max-w-xs p-2 rounded border border-gray-300"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <button
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 px-4 rounded hover:from-gray-600 
                    hover:to-gray-800 sm:flex items-center justify-center whitespace-nowrap"
                    onClick={handleOpen}
                  >
                    <span className="hidden md:inline">Add New Item</span>
                    <svg className="w-6 h-6 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                  <button
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 px-4 rounded hover:from-gray-600 
                      hover:to-gray-800 sm:flex items-center justify-center whitespace-nowrap"
                    onClick={handleOpenCamera}
                  >
                    <span className="hidden md:inline">Capture Item</span>
                    <svg className="w-6 h-6 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h2m0 0h16M5 7l1-2h12l1 2m-14 0v12m0 0h16V7m-16 0h16M4 14h.01M4 10h.01M4 18h.01M20 14h.01M20 10h.01M20 18h.01M8 14h8v2H8zm0-4h8v2H8z"></path>
                    </svg>
                  </button>
                  <UserButton />
                </div>
              </div>
            </div>
            <div className="fixed top-0 -z-10 h-full w-full">
              <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            </div>
            <div className="flex flex-col items-center h-screen pt-20">
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleOpen={handleOpen} handleOpenCamera={handleOpenCamera} />
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
                            addItem(itemName);
                            setItemName('');
                            handleClose();
                          }}
                        >Add</Button>
                      </Stack>
                    </Box>
                  </Modal>

                  <Modal open={isCameraOpen} onClose={handleCloseCamera}>
                    <Box className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                      <Box className="w-full h-full bg-white p-4 relative">
                        <CameraCapture onCapture={handleCapture} onClose={handleCloseCamera} />
                        <button
                          className="absolute top-4 right-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
                          onClick={handleCloseCamera}
                        >
                          Close
                        </button>
                      </Box>
                    </Box>
                  </Modal>

                  <InventoryList inventory={filteredInventory} addItem={addItem} removeItem={removeItem} deleteItem={deleteItem} />
                </Box>
              </div>
            </div>
          </>
        )}
      </SignedIn>
    </div>
  );
}
