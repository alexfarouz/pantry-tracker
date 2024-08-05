import { CameraIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const Sidebar = ({ isOpen, toggleSidebar, handleOpen, handleOpenCamera }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gradient-to-b from-gray-800 to-gray-600 text-white flex flex-col p-4 z-20`}>
      <button onClick={toggleSidebar} className="mb-4 text-white self-end">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h1 className="text-2xl font-bold mb-4 text-blue-200">Pantry Tracker</h1>
      <ul>
        <li className="mb-2 hover:text-blue-200"><Link href="/">Pantry</Link></li>
        <li className="mb-2 hover:text-blue-200"><Link href="/grocery-list">Grocery List</Link></li>
        <li className="mb-2 hover:text-blue-200"><Link href="/recipe-suggestions">Recipes</Link></li>
      </ul>
      <button
        className="bg-gradient-to-r from-blue-200 to-blue-400 text-white py-2 px-4 rounded mt-4 hover:from-blue-400 hover:to-blue-600 flex items-center justify-center space-x-2"
        onClick={handleOpen}
      >
        <PlusCircleIcon className="w-6 h-6" />
        <span>Add New Item</span>
      </button>
      <button
        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded mt-4 hover:from-gray-600 hover:to-gray-700 flex items-center justify-center space-x-2"
        onClick={handleOpenCamera}
      >
        <CameraIcon className="w-6 h-6" />
        <span>Capture Item</span>
      </button>
      <div className="bg-slate-800 p-4 mt-auto w-48 flex items-center rounded-md cursor-pointer" onClick={() => document.querySelector('#clerk-button').click()}>
        <UserButton />
        <span className="ml-3">Manage Account</span>
      </div>
    </div>
  );
};

export default Sidebar;
