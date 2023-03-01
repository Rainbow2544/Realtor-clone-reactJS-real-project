import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OAuth from "../components/OAuth";

export default function ForgetPassword() {
  
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: "",
    });
    const { email } = formData;
    
    

    function onChangeHandler(event){
      console.log(event.target.value);
      setFormData((prevState)=>({
        ...prevState,
        [event.target.id]: event.target.value,
      }));
    }

    async function onSubmit(event){
      event.preventDefault();
    }
    return (
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">Forgot password</h1>
        <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
          <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
            <img src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80' 
            alt='signIn'
            className='w-full rounded-2xl'/>
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form onSubmit={onSubmit}>
              <input 
                type="email"
                id='email'
                value={email}
                onChange={onChangeHandler}
                placeholder="Enter your email"
                className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              />
              
              <div>
                <div className='flex justify-between'>
                <p>Don't have a account?</p>
                
                <Link 
                  to="/sign-up"
                  className='  text-red-500 hover:text-red-700 transition ease-in-out'
                >  
                Join us today!
                </Link>
                </div>
                
                
                <Link 
                  to="/log-in"
                  className=' text-blue-500 hover:text-blue-700 transition ease-in-out'
                >
                  Log in instead
                </Link>
                
              </div>
              <button type='submit'
              className='w-full bg-blue-600 text-white px-3 py-3 mt-6 mb-3 rounded shadow-md hover:bg-blue-700 ease-in-out hover:shadow-lg active:bg-blue-800'>
                Send reset password
              </button>
              <div className='flex items-center my-4 before:border-t before:flex-1 before:border-black after:border-t after:flex-1 after:border-black'>
                <p className="text-center font-semibold mx-4">OR</p>
              </div>
              <OAuth />
            </form>
            
          </div>
        </div>
      </section>
    )
}
