import React, { useState, useContext } from 'react';
import { SettingOutlined, CarOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../../contexts/UserContext';
import AddressEditModal from './AddressEditModal';
import PropTypes from 'prop-types';
import BankDetailsModal from './BankDetailsModal';

import Avatar from '../common/Avatar';
export const UserCard = ({ userProfile, openEditModal }) => {
  const { currentUser } = useContext(UserContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const openBankModal = () => {
    setIsBankModalOpen(true);
  };

  // Really this data are not used, in backend there are data for testing provided by Stripe
  const handleBankDetailsSubmit = async (bankDetails) => {
    try {
      console.log(bankDetails);
      // Send a POST request to your backend API to save the bank details
      const response = await fetch('http://localhost:8000/api/orders/create-connect-account', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json' // Set Content-Type header
        },
        body: JSON.stringify(bankDetails) // Send the bank details in the request body
      });

      if (response.ok) {
        console.log('Bank details saved successfully');

        setIsBankModalOpen(false);
      } else {
        console.error('Failed to save bank details:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 pt-12 sm:w-80">
      {/* User Icon */}
      <Avatar imageUrl={userProfile.avatar} />
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
      {currentUser === userProfile.username && (
        <div className="flex gap-4">
          <CarOutlined onClick={openAddressModal} />
          <button
            className="rounded-3xl border border-mainColor px-6 py-2 text-mainColor"
            onClick={openEditModal}>
            Edit profile
          </button>
          <SettingOutlined onClick={openBankModal} />
        </div>
      )}
      <AddressEditModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
      <BankDetailsModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onBankDetailsSubmit={handleBankDetailsSubmit}
      />
    </div>
  );
};

UserCard.propTypes = {
  userProfile: PropTypes.object.isRequired,
  openEditModal: PropTypes.func.isRequired
};
