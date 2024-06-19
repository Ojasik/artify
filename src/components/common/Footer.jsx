import React from 'react';

const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full bg-gray-100 py-4 text-center">
      <hr className="absolute top-0 mb-4 w-full border-t border-gray-300" />
      <div className="mx-auto">
        <p className="text-sm ">&copy; Artify {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
