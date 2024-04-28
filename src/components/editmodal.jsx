import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

export const Editmodal = ({ isOpen, onClose, onProfileUpdate, initialProfileData }) => {
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    description: '',
    website: '',
    x: '',
    instagram: '',
    facebook: '',
    avatar: ''
  });

  useEffect(() => {
    // Set the form data with initial profile data when the modal opens
    setFormData({
      firstName: initialProfileData.firstname || '',
      lastName: initialProfileData.lastname || '',
      username: initialProfileData.username || '',
      description: initialProfileData.description || '',
      website: initialProfileData.website || '',
      x: initialProfileData.x || '',
      instagram: initialProfileData.instagram || '',
      facebook: initialProfileData.facebook || '',
      avatar: initialProfileData.avatar || ''
    });
  }, [initialProfileData]);

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
      const response = await fetch('http://localhost:8000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();

        // Check if the response contains the updated token
        const newToken = responseData.newToken;
        if (newToken) {
          // Update local storage with the new token
          localStorage.setItem('token', newToken);
        }
        console.log('Profile updated successfully');
        onProfileUpdate();
        onClose();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error during profile update:', error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      as="div"
      className="relative z-10"
      initialFocus={cancelButtonRef}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:mt-0 sm:text-center">
                <Dialog.Title as="h3" className="pb-3 text-2xl font-semibold text-gray-900">
                  Edit profile
                </Dialog.Title>
                <div className="mt-2">
                  <form
                    id="editProfileForm"
                    className="flex flex-col items-center gap-4"
                    onSubmit={handleFormSubmit}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      value={formData.website}
                      name="website"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      onChange={handleInputChange}
                      placeholder="Website (optional)"
                    />
                    <input
                      type="text"
                      value={formData.x}
                      name="x"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      onChange={handleInputChange}
                      placeholder="X (optional)"
                    />
                    <input
                      type="text"
                      value={formData.instagram}
                      name="instagram"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      onChange={handleInputChange}
                      placeholder="Instagram (optional)"
                    />
                    <input
                      type="text"
                      value={formData.facebook}
                      name="facebook"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      onChange={handleInputChange}
                      placeholder="Facebook (optional)"
                    />
                    <textarea
                      value={formData.description}
                      name="description"
                      className="w-80 rounded-2xl border border-black p-2 px-4"
                      onChange={handleInputChange}
                      placeholder="Description (optional)"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current.click()}>
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Profile Icon"
                          className="h-24 w-24 rounded-full"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-12 w-12 text-gray-400">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
                form="editProfileForm">
                Save
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
                ref={cancelButtonRef}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

Editmodal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfileUpdate: PropTypes.func.isRequired,
  initialProfileData: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    username: PropTypes.string,
    description: PropTypes.string,
    website: PropTypes.string,
    x: PropTypes.string,
    instagram: PropTypes.string,
    facebook: PropTypes.string,
    avatar: PropTypes.string
  })
};
