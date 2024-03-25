import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const UserCard = ({ userProfile, openEditModal }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-12 sm:w-80">
      {/* User Icon */}
      <div className="mb-2 h-40 w-40 rounded-full bg-mainColor"></div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {userProfile.firstname} {userProfile.lastname}
        </h1>
        <h1 className="text-lg">{userProfile.username}</h1>
      </div>
      <p className="px-6 text-center text-gray-500">{userProfile.description}</p>
      <div className="flex gap-2">
        <GlobeAltIcon className="w-4 text-gray-500" />
        <a className="font-semibold" href="">
          {userProfile.website}
        </a>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button className="w-52 rounded-3xl bg-mainColor py-2 text-white">Follow</button>
        <div className="flex gap-6">
          {userProfile.facebook && (
            <a href={userProfile.facebook} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon className="text-xl text-gray-500" icon={faFacebookF} />
            </a>
          )}
          {userProfile.x && (
            <a href={userProfile.x} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon className="text-xl text-gray-500" icon={faXTwitter} />
            </a>
          )}
          {userProfile.instagram && (
            <a href={userProfile.instagram} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon className="text-xl text-gray-500" icon={faInstagram} />
            </a>
          )}
        </div>
      </div>
      <hr className="w-60" />
      <div className="text-sm">Member since {new Date(userProfile.created_at).toDateString()}</div>
      <button
        className="rounded-3xl border border-mainColor px-6 py-2 text-mainColor"
        onClick={openEditModal}>
        Edit profile
      </button>
    </div>
  );
};

UserCard.propTypes = {
  userProfile: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired
};

export default UserCard;
