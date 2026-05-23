

import { useContext } from 'react'
import { assets } from '../assets/assets'
import Button from './Button'
import { AppContent } from '../context/AppContext'

const Header = () => {

  const { userData } = useContext(AppContent)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-white'>
      <img src={assets.iqbal} alt="hero" className='w-45 h-45 rounded-full mb-6 object-cover border border-white' />

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Aur {userData ? userData.name : 'Bhai'} Kia Haal Hain ?</h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Hamari Website Main Khush Amdeed</h2>

      <p className='mb-8 max-w-md'>Iss Website Main Ap Login and Signup Kar Sakte Hu Bade Araam Se Meri Jaan</p>

      {/* <button>Chalo Start Karo</button> */}

      <Button text="Chalo Start Karo" className="bg-white text-gray-900 hover:bg-gray-200" />

    </div>
  )
}

export default Header