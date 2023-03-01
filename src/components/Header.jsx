import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState("Sign in");

  

  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' alt="logo" 
                className='h-5 cursor-pointer'onClick ={() => navigate("/")}/>
            </div>
            <div>
                <ul className='flex space-x-10'>
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
                      pathMatchRoute("/offers") && "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/offers")}
                  >
                    Offers
                  </li>
                  <li
                    className={`cursor-pointer py-3 text-sm font-semibold text-black hover:border-b-[3px] hover:border-b-red-500  ${
                      (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                      "text-gray-400 border-b-[3px] border-b-red-500"
                    }`}
                    onClick={() => navigate("/profile")}
                  >
                    Sign in
                  </li>
                </ul>
            </div>
        </header>
        
    </div>
  );
}
