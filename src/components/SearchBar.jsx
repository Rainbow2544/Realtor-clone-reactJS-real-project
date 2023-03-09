import React, { useState } from "react";


function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    //onSearch(searchTerm);
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
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                Search
            </button>
        </div>
    </form>

    
    
  );
}

export default SearchBar;
