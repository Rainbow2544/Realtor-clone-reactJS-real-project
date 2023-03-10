import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';



function SearchBar() {
  
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if(searchTerm.length > 0){
      navigate(`/searchResults/${searchTerm}`);
      setSearchTerm('');
    }
    
    
    
  }
  
  return (

    <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-full px-6 py-3 flex justify-center items-center">
            <input
                type="text"
                value={searchTerm} 
                onChange={handleChange}
                
                placeholder="Address, School, City, Zip or Neighborhood"
                className="bg-transparent outline-none w-[60%] mr-4"
            />
            <button 
              type='submit'
              className="bg-red-500 hover:bg-red-600 active:bg-red-700  shadow hover:shadow-lg active:shadow-lg font-semibold text-white px-4 py-2 rounded-full duration-200 ease-in-out">
                Search
            </button>
        </div>
    </form>

    
    
  );
}

export default SearchBar;
