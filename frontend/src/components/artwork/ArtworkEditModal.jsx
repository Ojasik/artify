import React, { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Image } from 'antd';

const getImageContainerClass = (numImages) => {
  if (numImages === 2) {
    return 'grid grid-cols-2 gap-4';
  } else if (numImages >= 3) {
    return 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4';
  }
};

export const ArtworkEditModal = ({ isOpen, onClose, artwork, updateArtworks }) => {
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

    // Update the image state to remove the image at the specified index
    const updatedImages = formData.images.map((image, i) =>
      i === index ? { ...image, hidden: true } : image
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: updatedImages
    }));

    // Update removedImages state with the index
    setRemovedImages((prevRemovedImages) => [...prevRemovedImages, index]);
  };

  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      const response = await fetch(`https://artify-backend-0eef31091a04.herokuapp.com/api/artworks/${artwork._id}`, {
        method: 'PUT',
        credentials: 'include',
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
    } finally {
      setLoading(false); // Reset loading state after data update
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
    <Modal
      title="Edit artwork"
      open={isOpen}
      onCancel={handleCancel}
      closeIcon={<CloseOutlined />}
      okButtonProps={{ disabled: loading }}
      maskClosable={false}
      destroyOnClose
      footer={[
        <button
          key="cancel"
          className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={handleCancel}>
          Cancel
        </button>,
        <button
          key="save"
          className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={handleSave}>
          Save
        </button>
      ]}>
      <div className="mt-2">
        <form
          id="editArtworkForm"
          className="flex flex-col items-center gap-4"
          onSubmit={handleSave}>
          <div className="flex flex-col items-start">
            <label htmlFor="title" className="block pl-4 text-sm font-medium text-mainColor">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="w-80 rounded-full border border-black p-2 px-4"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="price" className="block pl-4 text-sm font-medium text-mainColor">
              Price
            </label>
            <input
              type="text"
              name="price"
              placeholder="Price"
              className="w-80 rounded-full border border-black p-2 px-4"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="category" className="block pl-4 text-sm font-medium text-mainColor">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-80 rounded-full border border-black p-2 px-4">
              <option value="Painting">Painting</option>
              <option value="Sculpture">Sculpture</option>
              <option value="Literature">Literature</option>
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="about" className="block pl-4 text-sm font-medium text-mainColor">
              About
            </label>
            <input
              type="text"
              placeholder="About"
              name="about"
              className="w-80 rounded-full border border-black p-2 px-4"
              value={formData.about}
              onChange={handleInputChange}
              required
            />
          </div>
          <label className="inline-flex w-full cursor-pointer justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto">
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
          <div className={getImageContainerClass(formData.images.length)}>
            <Image.PreviewGroup>
              {formData.images.map(
                (image, index) =>
                  !image.hidden && (
                    <div key={index} className="relative">
                      <Image
                        src={image.data}
                        alt={`Artwork ${index + 1}`}
                        className="rounded-md"
                        style={
                          formData.images.length === 1
                            ? { width: '315px', maxHeight: '315px', objectFit: 'cover' }
                            : { width: '150px', maxHeight: '150px', objectFit: 'cover' }
                        }
                      />
                      {formData.images.filter((img) => !img.hidden).length > 1 && (
                        <CloseOutlined
                          className="absolute right-1 top-1 rounded-full bg-mainColor p-1 text-sm text-white"
                          onClick={(e) => handleRemoveImage(index, e)}
                        />
                      )}
                    </div>
                  )
              )}
            </Image.PreviewGroup>
          </div>
        </form>
      </div>
    </Modal>
  );
};
