import React from 'react';
import logo from '../assets/images/logo.png';
export const Logo = () => {
  return (
    <div className="flex flex-shrink-0 items-center">
      <img className="h-16 w-auto" src={logo} alt="Artify" />
      <div className="text-4xl">artify</div>
    </div>
  );
};
