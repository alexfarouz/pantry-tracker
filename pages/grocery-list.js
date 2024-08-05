import { useState, useEffect } from 'react';
import Sidebar from '../app/components/Sidebar';
import GroceryList from '../app/components/GroceryList';
import '../app/globals.css';
import { UserButton, SignedIn, SignedOut, SignIn } from '@clerk/nextjs';

export default function GroceryListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 825);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased">
      <SignedOut>
        <div className="h-screen flex items-center justify-center">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
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
              <UserButton />
            </div>
          </div>
        </div>
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
        <div className="flex flex-col items-center h-screen pt-20">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen && isWideScreen ? 'ml-64' : 'ml-0'}`}>
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 mx-auto">
              <GroceryList />
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
