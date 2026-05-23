

import { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify'
import api from '../utils/api';

const Login = () => {

  const navigate = useNavigate();

  const { backendURL, setIsLogged, getUserData } = useContext(AppContent)

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {

    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await api.post('/api/auth/register', { name, email, password });

        if (data.success) {
          setIsLogged(true);
          getUserData();
          navigate('/');
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const { data } = await api.post('/api/auth/login', { email, password })

        if (data.success) {
          setIsLogged(true);
          getUserData();
          navigate('/')
        }
        else {
          toast.error(data.message)
        }

      }

    } catch (error) {
      toast.error(error.message)
    }

  }

  return (
    <div className='flex items-center justify-center min-h-screen p-9 sm:p-6 sm:px-24 bg-slate-600'>
      {/* <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-27 sm:w-33 cursor-pointer' /> */}
      <p onClick={() => navigate('/')} className='text-3xl font-bold text-white p-9 sm:p-6 sm:px-24 absolute top-0 left-0'>AUTH</p>

      <div className='bg-gray-900 p-9 rounded-xl w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Your Account' : 'Login to Your Account'}</h2>

        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Join us today and create your account' : 'Welcome back! Please enter your details'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333a5c] text-white'>
              <img src={assets.person_icon} alt="icon" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none text-lg' type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333a5c] text-white'>
            <img src={assets.mail_icon} alt="icon" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none text-lg' type="email" placeholder='Email' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333a5c] text-white'>
            <img src={assets.lock_icon} alt="icon" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none text-lg' type="password" placeholder='Password' required />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-300 cursor-pointer'>Forgot Password?</p>

          <Button text={state} type="submit" className="bg-white w-full text-center" />

          {/* <button
            type="submit"
            className="bg-white w-full text-center py-2 rounded-full font-semibold cursor-pointer hover:bg-gray-200 transition-all"
          >
            {state}
          </button> */}
        </form>

        {
          state === 'Sign Up' ? (
            <p className='text-indigo-300 text-center text-sm mt-3'>
              Already Have An Account?
              <span onClick={() => setState('Login')} className='text-white cursor-pointer underline pl-1'>Login Here</span>
            </p>
          ) : (
            <p className='text-indigo-300 text-center text-sm mt-3'>
              Donot Have An Account?
              <span onClick={() => setState('Sign Up')} className='text-white cursor-pointer underline pl-1'>Sign Up</span>
            </p>
          )
        }

      </div>
    </div>
  )
}

export default Login