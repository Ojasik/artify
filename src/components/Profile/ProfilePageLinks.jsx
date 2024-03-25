import React from 'react';
import PropTypes from 'prop-types';

const ProfilePagesLinks = ({ profilePages }) => {
  return (
    <div className="mx-auto flex flex-wrap justify-center gap-4 py-12 sm:mx-0">
      {profilePages.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`${
            item.current
              ? 'bg-mainColor text-white'
              : 'text-black hover:bg-gray-400 hover:text-white'
          } rounded-3xl px-3 py-1 font-semibold`}>
          {item.name}
        </a>
      ))}
    </div>
  );
};

ProfilePagesLinks.propTypes = {
  profilePages: PropTypes.array.isRequired
};

export default ProfilePagesLinks;
