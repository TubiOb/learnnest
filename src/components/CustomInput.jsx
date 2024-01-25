import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const CustomInput = ({ type, placeholder, label, value, onChange }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <label htmlFor={label} className="relative block rounded-lg border w-full focus-within:border-white outline-none">
      
      <div className="flex box flex-row items-center w-full bg-blue-100 peer-focus:bg-blue-100 focus:bg-blue-100 rounded-lg" >
        <input
          type={type === 'password' && passwordVisible ? 'text' : type}
          id={label}
          className="peer border-none bg-inherit bg-blue-50 w-full h-full focus:bg-blue-100 placeholder-transparent py-2.5 md:py-2 lg:py-2 px-2 xl:px-3.5 xl:py-3 text-sm md:text-sm lg:text-base focus:border-transparent focus:outline-none rounded-lg focus:ring-0 required:border-red-500"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {type === 'password' && (
          <div className='w-auto h-full secure bg-blue-100 peer-focus:bg-blue-100 rounded-r-lg flex items-center py-2 md:py-1.5 lg:py-1 px-2 xl:px-3 xl:py-2.5' >
            {passwordVisible ? (
              <AiOutlineEyeInvisible className="cursor-pointer w-5 h-5 xl:w-6 xl:h-6" onClick={togglePasswordVisibility} />
            ) : (
              <AiOutlineEye className="cursor-pointer w-5 h-5 xl:w-6 xl:h-6" onClick={togglePasswordVisibility} />
            )}
          </div>
        )}
        {/* <span className="pointer-events-none absolute start-3.5 bg-transparent backdrop-blur-sm peer-focus:bg-transparent top-0 -translate-y-1/2 p-0.5 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">{label}</span> */}
        <span className="pointer-events-none absolute start-3.5 bg-transparent backdrop-blur-sm peer-focus:bg-transparent top-0 -translate-y-1/2 p-0.5 text-sm text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">{label}</span>
      </div>
    </label>
  );
};

export default CustomInput;
