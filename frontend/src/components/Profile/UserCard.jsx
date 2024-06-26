import React, { useState, useContext } from 'react';
import { message } from 'antd';
import { SettingOutlined, CarOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { UserContext } from '../../contexts/UserContext';
import AddressEditModal from './AddressEditModal';
import BankDetailsModal from './BankDetailsModal';

import Avatar from '../common/Avatar';
export const UserCard = ({ userProfile, openEditModal }) => {
  const { currentUser } = useContext(UserContext);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const openBankModal = () => {
    setIsBankModalOpen(true);
  };

  const handlePasswordChangeSubmit = async (passwordDetails) => {
    try {
      console.log(passwordDetails);
      const response = await fetch('http://localhost:8000/api/users/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordDetails)
      });

      if (response.ok) {
        console.log('Password changed successfully');
        setIsBankModalOpen(false);
        message.success('Password changed successfully');
      } else if (response.status === 400) {
        const data = await response.json();
        message.error(data.message);
      } else {
        console.error('Failed to change password:', response.statusText);
        message.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Error changing password');
    }
  };

  const handleBankDetailsSubmit = async (bankDetails) => {
    try {
      console.log(bankDetails);

      const response = await fetch('http://localhost:8000/api/orders/create-connect-account', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankDetails)
      });

      if (response.ok) {
        console.log('Bank details saved successfully');
        message.success('Bank details saved successfully');
        setIsBankModalOpen(false);
      } else {
        console.error('Failed to save bank details:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 overflow-hidden pt-12 sm:w-80">
      {/* User Icon */}
      <Avatar imageUrl={userProfile.avatar} />
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {userProfile.firstname} {userProfile.lastname}
        </h1>
        <h1 className="text-lg">{userProfile.username}</h1>
      </div>
      {userProfile.description && (
        <p className="overflow-wrap max-w-full break-words px-6 text-center text-gray-500">
          {userProfile.description}
        </p>
      )}
      {userProfile.website && (
        <div className="flex gap-2">
          <GlobeAltIcon className="w-4 text-gray-500" />
          <a className="font-semibold" href="">
            {userProfile.website}
          </a>
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
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
            className="rounded-full border border-mainColor px-6 py-2 text-mainColor transition-colors duration-300 hover:bg-mainColor hover:text-white"
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
        onChangePasswordSubmit={handlePasswordChangeSubmit}
      />
    </div>
  );
};
