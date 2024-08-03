import { Button } from '@mui/material';

const Sidebar = ({ isOpen, toggleSidebar, handleOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gradient-to-b from-gray-800 to-gray-600 text-white flex flex-col p-4 z-20`}>
      <button onClick={toggleSidebar} className="mb-4 text-white self-end">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <h1 className="text-2xl font-bold mb-4 text-blue-200">Pantry Tracker</h1>
      <ul>
        <li className="mb-2"><a href="#" className="text-white">Dashboard</a></li>
        <li className="mb-2"><a href="#" className="text-white">Inventory</a></li>
        <li className="mb-2"><a href="#" className="text-white">Settings</a></li>
      </ul>
      <button
        className="bg-gradient-to-r from-blue-200 to-blue-400 text-white py-2 px-4 rounded mt-4 hover:from-blue-400 hover:to-blue-600"
        onClick={handleOpen}
      >
        Add New Item
      </button>
    </div>
  );
};

export default Sidebar;
