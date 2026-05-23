import React from 'react'

const Button = ({ text, icon, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden border border-gray-500 rounded-full px-6 py-2 flex items-center justify-center gap-2 group cursor-pointer ${className || ''}`}
    >
      {/* Background Animation */}
      <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></span>

      {/* Text */}
      <span className="relative z-10 text-gray-900 group-hover:text-white transition-colors duration-300">
        {text}
      </span>

      {/* Icon */}
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="relative z-10 transition-all duration-300 group-hover:invert"
        />
      )}
    </button>
  )
}

export default Button