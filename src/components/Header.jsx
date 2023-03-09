import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {FaSearch} from "react-icons/fa";
import SearchBar from "./SearchBar";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState(false);
  const [search, setSearch] = useState(false);

  const auth = getAuth();
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if(user){
        setPageState(true);
        console.log("true from user");
        
        
      }else{
        setPageState(false);
        console.log("v");
        
      }
    }
    );
  }, [auth]);
  console.log("userStage"+pageState);
  //setPageState("profile");
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      
      return true;
    }
  }

  function Logout() {
    auth.signOut();
    navigate("/");
  }

  function onSearchClick(){
    setSearch((prev)=> !prev);
  }

  
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt="logo" 
                className='h-5 cursor-pointer'onClick ={() => navigate("/")}/>
            </div>
            <div className='ml-5'> 
                <ul className='flex space-x-8'>
                  <li
                    className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500 ${
                      pathMatchRoute("/") && "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/")}
                  >
                    Home
                  </li>
                  <li
                    className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500  ${
                      pathMatchRoute("/sell") && "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/sell")}
                  >
                    Buy
                  </li>

                  <li
                    className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500  ${
                      pathMatchRoute("/rent") && "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/rent")}
                  >
                    Rent
                  </li>
                  
                  
                  {pageState && <li
                    className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500  ${
                      (pathMatchRoute("/log-in") || pathMatchRoute("/profile")) &&
                      "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </li>}
                  {pageState &&
                  <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500 
                    
                  `}
                  onClick={Logout}
                  >
                    Log out
                  </li>
                  }


                  {!pageState && <li
                    className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500  ${
                      (pathMatchRoute("/log-in") || pathMatchRoute("/profile")) &&
                      "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/log-in")}
                  >
                    Log in
                  </li>}
                  
                  {!pageState && <li
                  className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500  ${
                    (pathMatchRoute("/sign-up") || pathMatchRoute("/profile")) &&
                    "text-gray-400 border-b-[3px] border-b-red-500"
                  }`}
                  onClick={() => navigate("/sign-up")}
                >
                  Sign up
                </li>}
                <li className='mt-1'>
                  <button 
                    onClick={onSearchClick}
                    className='p-3 bg-blue-500 rounded-full'>
                    <FaSearch/>
                  </button>
                  
                </li>
                </ul>
            </div>
            
            <div 
              className={`${
              search ? 'block' : 'hidden'
            } absolute top-full left-0 right-0 mt-2`}>
              <SearchBar />
            </div>
        </header>
        
    </div>
  );
}
