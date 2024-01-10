import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

export const Editmodal = ({ isOpen, onClose }) => {
  const cancelButtonRef = useRef(null);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle the case where the user is not authenticated
        return;
      }

      if (response.ok) {
        // Profile update successful
        onClose();
      } else {
        // Handle the case where the server returns an error
        console.error('Profile update failed:', response.statusText);
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error('Error updating profile:', error);
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
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Edit profile
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleFormSubmit}>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="Website"
                      />
                      <input
                        type="text"
                        value={formData.x}
                        onChange={handleInputChange}
                        placeholder="X"
                      />
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="Instagram"
                      />
                      <input
                        type="text"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="Facebook"
                      />
                      <button type="submit">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={onClose}>
                Deactivate
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
  onClose: PropTypes.func.isRequired
};
