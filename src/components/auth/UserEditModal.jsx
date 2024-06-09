/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

export const UserEditModal = ({ isOpen, onClose, rowData, onUpdateSuccess }) => {
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: rowData.username,
    firstname: rowData.firstname,
    lastname: rowData.lastname,
    email: rowData.email,
    phone: rowData.phone,
    description: rowData.profile.description,
    website: rowData.profile.website,
    x: rowData.profile.x,
    instagram: rowData.profile.instagram,
    facebook: rowData.profile.facebook,
    avatar: rowData.profile.avatar
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/users/user/${rowData._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Profile updated successfully');
        onUpdateSuccess();
        onClose();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

  return (
    <Modal
      title="Edit profile"
      open={isOpen}
      onCancel={onClose}
      maskClosable={false}
      footer={[
        <button
          key="cancel"
          className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={onClose}
          ref={cancelButtonRef}>
          Cancel
        </button>,
        <button
          key="save"
          className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={handleFormSubmit}>
          Save
        </button>
      ]}>
      <form id="editProfileForm" onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="firstName" className="block pl-4 text-sm font-medium text-mainColor">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
              required
            />
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="lastName" className="block pl-4 text-sm font-medium text-mainColor">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              placeholder="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
              required
            />
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="website" className="block pl-4 text-sm font-medium text-mainColor">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
              placeholder="Website (optional)"
            />
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="x" className="block pl-4 text-sm font-medium text-mainColor">
              X
            </label>
            <input
              type="text"
              id="x"
              name="x"
              value={formData.x}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
              placeholder="X (optional)"
            />
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="instagram" className="block pl-4 text-sm font-medium text-mainColor">
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
              placeholder="Instagram (optional)"
            />
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="facebook" className="block pl-4 text-sm font-medium text-mainColor">
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
              placeholder="Facebook (optional)"
            />
          </div>
          <div className="col-span-2 flex flex-col items-start pb-4">
            <label htmlFor="description" className="block pl-4 text-sm font-medium text-mainColor">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-black p-2 px-4"
              placeholder="Description (optional)"
            />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col items-center justify-center">
              {formData.avatar && (
                <span className="h-36 w-36 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={formData.avatar}
                    alt="Profile Icon"
                    className="h-full w-full object-cover"
                  />
                  <div className="mt-2 flex items-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-full bg-mainColor px-6 py-1 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:w-auto"
                      onClick={() => fileInputRef.current.click()}>
                      Upload Image
                    </button>
                    {formData.avatar && (
                      <button
                        type="button"
                        className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => setFormData({ ...formData, avatar: '' })}>
                        <CloseOutlined style={{ fontSize: '16px' }} />{' '}
                      </button>
                    )}
                  </div>
                </span>
              )}
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-full bg-mainColor px-6 py-1 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:w-auto"
                  onClick={() => fileInputRef.current.click()}>
                  Upload Image
                </button>
                {formData.avatar && (
                  <button
                    type="button"
                    className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => setFormData({ ...formData, avatar: '' })}>
                    <CloseOutlined style={{ fontSize: '16px' }} />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                id="avatar"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

UserEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
