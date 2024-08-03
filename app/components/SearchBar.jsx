// components/SearchBar.jsx
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="Search Pantry"
      className="p-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  );
};

export default SearchBar;
