import { useState } from 'react';
import RecipeSuggestions from '../app/components/RecipeSuggestions';
import '../app/globals.css'

export default function RecipeSuggestionsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpen = () => {
    // Handle opening the add new item modal
  };

  const handleOpenCamera = () => {
    // Handle opening the camera modal
  };

  return (
    <RecipeSuggestions
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
      handleOpen={handleOpen}
      handleOpenCamera={handleOpenCamera}
    />
  );
}