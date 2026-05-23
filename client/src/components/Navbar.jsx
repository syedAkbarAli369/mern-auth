

import { useContext } from 'react';
import { assets } from '../assets/assets.js'
import Button from './Button.jsx'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();
  const { userData, backendURL, setIsLogged, setUserData } = useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + '/api/auth/send-verify-otp');

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message)
      }
      else {
        toast.error(data.message)
      }


    } catch (error) {
      toast.error(error.message)

    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + '/api/auth/logout')
      data.success && setIsLogged(false);
      data.success && setUserData(false);
      navigate('/')

    } catch (error) {
      toast.error(error.message)

    }
  }

  return (
    <div className='w-full flex justify-between items-center p-9 sm:p-6 sm:px-24 absolute top-0 z-10 '>
      {/* <img src={assets.logo} alt="logo" className='w-27 sm:w-33' /> */}
      <p className='text-3xl font-bold text-white'>AUTH</p>

      {/* <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-900 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="icon" /></button> */}

      {
        userData ?
          <div className='relative group'>
            <Button className="px-0 py-0 w-12 h-12 rounded-full bg-white" text={userData.name[0].toUpperCase()} />
            <div className='absolute hidden group-hover:block top-12 right-0 z-10 text-black rounded transition-all bg-white w-36'>
              <ul className='list-none m-0 text-sm sm:text-sm p-2'>
                {
                  !userData.isAccountVerified && <li onClick={sendVerificationOtp} className='p-2 hover:bg-gray-100 cursor-pointer'>Verify Email</li>
                }
                <li onClick={logout} className='p-2 hover:bg-gray-100 cursor-pointer'>Logout</li>
              </ul>
            </div>
          </div>

          : <Button text="Login" className="bg-white text-gray-900 hover:bg-gray-200" icon={assets.arrow_icon} onClick={() => navigate('/login')} />
      }


    </div>
  )
}

export default Navbar