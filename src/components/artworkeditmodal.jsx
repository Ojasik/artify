import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

const ArtworkEditModal = ({ isOpen, onClose, artwork, updateArtworks }) => {
  const cancelButtonRef = useRef(null);
  const [removedImages, setRemovedImages] = useState([]);

  const clearRemovedImages = () => {
    setRemovedImages([]);
  };

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    about: '',
    category: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    setFormData({
      title: artwork.title || '',
      price: artwork.price || '',
      about: artwork.about || '',
      category: artwork.category || '',
      images: artwork.images || []
    });
  }, [artwork]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagesArray = files.map((file) => ({
      data: URL.createObjectURL(file), // Convert file to URL
      hidden: false, // Initially not hidden
      file: file // Keep reference to file object
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ...newImagesArray]
    }));
    setNewImages([...newImages, ...files]);
  };

  const handleRemoveImage = (index, e) => {
    e.preventDefault();
    // Check if there's only one visible image left
    if (formData.images.filter((image) => !image.hidden).length <= 1) {
      return; // Don't remove the last remaining image
    }
    // Update the image state to hide the image at the specified index
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.map((image, i) =>
        i === index ? { ...image, hidden: true } : image
      )
    }));

    if (index >= formData.images.length - newImages.length) {
      setNewImages((prevNewImages) =>
        prevNewImages.filter((_, i) => i !== index - (formData.images.length - newImages.length))
      );
    }
    // Update removedImages state
    setRemovedImages((prevRemovedImages) => [...prevRemovedImages, index]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formDataWithImages = new FormData();
      formDataWithImages.append('title', formData.title);
      formDataWithImages.append('price', formData.price);
      formDataWithImages.append('category', formData.category);
      formDataWithImages.append('about', formData.about);
      formDataWithImages.append('removedImages', JSON.stringify(removedImages));
      console.log(formData.images);
      newImages.forEach((image, index) => {
        formDataWithImages.append(`images`, image);
      });
      const response = await fetch(`http://localhost:8000/api/artworks/${artwork._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataWithImages
      });

      if (response.ok) {
        const updatedArtworkData = await response.json();
        // Exclude removedImages from updatedArtworkData
        const { removedImages, ...artworkWithoutRemovedImages } = updatedArtworkData;
        updateArtworks((prevArtworks) =>
          prevArtworks.map((artwork) =>
            artwork._id === updatedArtworkData._id ? artworkWithoutRemovedImages : artwork
          )
        );
        handleCancel();
      } else {
        console.error('Failed to update artwork');
      }
    } catch (error) {
      console.error('Error updating artwork:', error);
    }
  };

  const handleCancel = () => {
    onClose();
    clearRemovedImages();
    setNewImages([]);
    setFormData({
      title: artwork.title || '',
      price: artwork.price || '',
      about: artwork.about || '',
      category: artwork.category || '',
      images: artwork.images || []
    });
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
                  Edit artwork
                </Dialog.Title>
                <div className="mt-2">
                  <form
                    id="editArtworkForm"
                    className="flex flex-col items-center gap-4"
                    onSubmit={handleSave}>
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
                      name="price"
                      placeholder="Price"
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
                      <option value="Painting">Painting</option>
                      <option value="Sculpture">Sculpture</option>
                      <option value="Literature">Literature</option>
                    </select>
                    <input
                      type="text"
                      placeholder="About"
                      name="about"
                      className="w-80 rounded-full border border-black p-2 px-4"
                      value={formData.about}
                      onChange={handleInputChange}
                      required
                    />
                    <label className="w-80 cursor-pointer rounded-full border border-black p-2 px-4">
                      Add Images
                      <input
                        type="file"
                        onChange={handleImageChange}
                        multiple
                        className="hidden"
                        name="images"
                        accept="image/*"
                      />
                    </label>
                    <div className="grid w-80 grid-cols-2 gap-2">
                      {formData.images.map(
                        (image, index) =>
                          !image.hidden && (
                            <div key={index} className="relative">
                              <img
                                src={image.data}
                                alt={`Artwork ${index + 1}`}
                                className="mb-4 rounded border border-black p-2 px-4"
                                style={{ maxWidth: '100%', width: '100%' }}
                              />
                              {formData.images.filter((img) => !img.hidden).length > 1 && ( // Check if there is more than one visible image
                                <button
                                  className="absolute right-0 top-0 rounded-full bg-red-500 p-2 text-white"
                                  onClick={(e) => handleRemoveImage(index, e)}>
                                  X
                                </button>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
                form="editArtworkForm">
                Save
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={handleCancel}
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

ArtworkEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateArtworks: PropTypes.func.isRequired,
  artwork: PropTypes.object.isRequired
};

export default ArtworkEditModal;
