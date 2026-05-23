

import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import Button from '../components/Button';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ResetPassword = () => {

  const { backendURL } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();

    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })

  }

  const onSubmitEmail = async (e) => {

    e.preventDefault();

    try {
      const { data } = await api.post('/api/auth/send-reset-otp', { email })

      if (data.success) {
        toast.success(data.message)
      }
      else {
        toast.error(data.message)
      }

      data.success && setIsEmailSent(true)

    } catch (error) {
      toast.error(error.message)

    }

  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {

      const { data } = await api.post('/api/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        toast.success(data.message)
      }
      else {
        toast.error(data.message)
      }

      data.success && navigate('/login')

    } catch (error) {
      toast.error(error.message)
    }

  }

  return (

    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-slate-600 overflow-hidden'>
      <p onClick={() => navigate('/')} className='text-3xl font-bold text-white p-9 sm:p-6 sm:px-24 absolute top-0 left-0 cursor-pointer'>AUTH</p>

      {/* Enter email Id */}

      {!isEmailSent &&
        <form
          onSubmit={onSubmitEmail}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm overflow-hidden'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter Your Registered Email Address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.mail_icon} alt="mail" className='w-3 h-3' />
            <input type="email" placeholder='Email Id' className='bg-transparent outline-none text-white'
              value={email}
              onChange={e => setEmail(e.target.value)} required
            />

          </div>

          <Button text="Submit" className="w-full bg-white" />
        </form>
      }

      {/* OTP input form */}

      {!isOtpSubmitted && isEmailSent &&
        <form
          onSubmit={onSubmitOtp}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm overflow-hidden'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => {
              return <input type='text' maxLength='1' key={index} required
                className='w-9 h-9 sm:w-12 sm:h-12 bg-[#333a5c] text-white text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            })}
          </div>
          <Button text="Submit" className="w-full bg-white" />
        </form>
      }

      {/* Enter new Password */}

      {isOtpSubmitted && isEmailSent &&
        <form
          onSubmit={onSubmitNewPassword}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter The New Password Below</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
            <img src={assets.lock_icon} alt="lock" className='w-3 h-3' />
            <input type="password" placeholder='New Password' className='bg-transparent outline-none text-white'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)} required
            />

          </div>

          <Button text="Submit" className="w-full bg-white" />
        </form>
      }
    </div>


  )
}

export default ResetPassword