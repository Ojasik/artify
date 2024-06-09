import React from 'react';
import PropTypes from 'prop-types';

const ProfilePagesLinks = ({ profilePages, onPageChange }) => {
  return (
    <div className="mx-auto flex flex-wrap justify-center gap-4 pb-6 pt-12 sm:mx-0">
      {profilePages.map((item) => (
        <button
          key={item.name}
          onClick={() => onPageChange(item.name)} // Add onClick event handler
          className={`${
            item.current
              ? 'bg-mainColor text-white'
              : 'text-black hover:bg-gray-400 hover:text-white'
          } rounded-3xl px-3 py-1 font-semibold`}>
          {item.name}
        </button>
      ))}
    </div>
  );
};

ProfilePagesLinks.propTypes = {
  profilePages: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired // Add onPageChange prop
};

export default ProfilePagesLinks;
