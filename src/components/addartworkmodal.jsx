import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

export const Addartworkmodal = ({ isOpen, onClose, onArtworkUpdate }) => {
  const initialFormData = {
    title: '',
    images: [],
    price: '',
    about: '',
    category: 'painting'
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('about', formData.about);
      formDataToSend.append('category', formData.category);

      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      const response = await fetch('http://localhost:8000/api/artworks/add-artwork', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        console.log('Artwork added successfully');
        onArtworkUpdate();
        setFormData(initialFormData);
        onClose();
      } else {
        console.error('Failed to add artwork');
      }
    } catch (error) {
      console.error('Error during artwork addition:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:mt-0 sm:text-center">
                <Dialog.Title as="h3" className="pb-3 text-2xl font-semibold text-gray-900">
                  Add artwork
                </Dialog.Title>
                <div className="mt-2">
                  <form
                    id="addArtworkForm"
                    className="flex flex-col items-center gap-4"
                    onSubmit={handleFormSubmit}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      name="price"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-80 rounded-full border border-black p-2 px-4">
                      <option value="painting">Painting</option>
                      <option value="sculpture">Sculpture</option>
                      <option value="literature">Literature</option>
                    </select>
                    <textarea
                      name="about"
                      className="w-80 rounded-2xl border border-black p-2 px-4"
                      placeholder="About"
                      value={formData.about}
                      onChange={handleInputChange}
                    />
                    <label className="w-80 cursor-pointer rounded-full border border-black p-2 px-4">
                      Add Images
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                    <div className="grid w-80 grid-cols-2 gap-2">
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="rounded border border-black p-2 px-4"
                          style={{ maxWidth: '100%' }}
                        />
                      ))}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
                form="addArtworkForm">
                Add artwork
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => {
                  resetForm();
                  onClose();
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

Addartworkmodal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onArtworkUpdate: PropTypes.func,
  onClose: PropTypes.func.isRequired
};
