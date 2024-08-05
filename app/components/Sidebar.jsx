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
      
      <div className="bg-slate-800 p-4 mt-auto w-48 flex items-center rounded-md cursor-pointer">
        <UserButton />
        <span className="ml-3">Manage Account</span>
      </div>
    </div>
  );
};

export default Sidebar;
