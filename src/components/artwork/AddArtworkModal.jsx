import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Image, Popover, message } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

const getImageContainerClass = (numImages) => {
  if (numImages === 2) {
    return 'grid grid-cols-2 gap-4';
  } else if (numImages >= 3) {
    return 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4';
  }
  return '';
};

const validationSchema = yup.object({
  title: yup.string().max(12, 'Title must be 12 characters or less').required('Title is required'),
  price: yup
    .number()
    .min(10, 'Price must be at least €10')
    .max(100000, 'Price must be at most €100,000')
    .required('Price is required'),
  category: yup.string().required('Category is required'),
  images: yup
    .array()
    .test('atLeastOneImage', 'At least one image is required', (images) => images.length > 0)
    .max(5, 'You can upload a maximum of 5 images'),
  weight: yup
    .number()
    .min(0, 'Weight must be greater than or equal to 0')
    .required('Weight is required'),
  size: yup.object({
    length: yup
      .number()
      .min(0, 'Length must be greater than or equal to 0')
      .required('Length is required'),
    width: yup
      .number()
      .min(0, 'Width must be greater than or equal to 0')
      .required('Width is required'),
    height: yup
      .number()
      .min(0, 'Height must be greater than or equal to 0')
      .required('Height is required')
  })
});

export const AddArtworkModal = ({ isOpen, onClose, onArtworkUpdate }) => {
  const [images, setImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      price: '',
      about: '',
      category: 'Painting',
      images: [],
      weight: '',
      size: {
        length: '',
        width: '',
        height: ''
      }
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const commissionPercentage =
          values.price <= 20 ? 0.2 : values.price <= 100 ? 0.15 : values.price <= 500 ? 0.1 : 0.05;
        const commission = values.price * commissionPercentage;
        const netEarnings = values.price - commission;

        const formDataToSend = new FormData();
        formDataToSend.append('title', values.title);
        formDataToSend.append('price', values.price);
        formDataToSend.append('about', values.about);
        formDataToSend.append('category', values.category);
        formDataToSend.append('commission', commission);
        formDataToSend.append('netEarnings', netEarnings);
        formDataToSend.append('weight', values.weight);
        formDataToSend.append('size[length]', values.size.length);
        formDataToSend.append('size[width]', values.size.width);
        formDataToSend.append('size[height]', values.size.height);
        console.log(formDataToSend);
        images.forEach((image) => {
          formDataToSend.append('images', image.file);
        });

        const response = await fetch('http://localhost:8000/api/artworks/add-artwork', {
          method: 'POST',
          body: formDataToSend,
          credentials: 'include'
        });

        if (response.ok) {
          console.log('Artwork added successfully');
          onArtworkUpdate?.();
          resetForm();
          setImages([]);
          onClose();
        } else {
          console.error('Failed to add artwork');
        }
      } catch (error) {
        console.error('Error during artwork addition:', error);
      }
    }
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      message.error('You can upload a maximum of 5 images');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
    formik.setFieldValue('images', [...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    formik.setFieldValue('images', newImages);
  };

  const resetForm = () => {
    formik.resetForm();
    setImages([]);
  };

  const commissionPercentage =
    formik.values.price <= 20
      ? 0.2
      : formik.values.price <= 100
        ? 0.15
        : formik.values.price <= 500
          ? 0.1
          : 0.05;

  const commission = formik.values.price * commissionPercentage;
  const netEarnings = formik.values.price - commission;

  const commissionContent = (
    <div>
      <p>&le; €20: 20%</p>
      <p>€21 - €100: 15%</p>
      <p>€101 - €500: 10%</p>
      <p>&gt; €500: 5%</p>
    </div>
  );

  return (
    <Modal
      title="Add Artwork"
      open={isOpen}
      maskClosable={false}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      footer={[
        <button
          key="cancel"
          className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => {
            resetForm();
            onClose();
          }}>
          Cancel
        </button>,
        <button
          key="save"
          className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={formik.handleSubmit}>
          Save
        </button>
      ]}>
      <form
        id="addArtworkForm"
        className="flex flex-col items-center gap-4"
        onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className={`mt-4 w-80 rounded-full border border-black p-2 px-4 ${
              formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-black'
            }`}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500">{formik.errors.title}</div>
          ) : null}
        </div>
        <div>
          <input
            type="number"
            placeholder="Price"
            name="price"
            className={`w-80 rounded-full border border-black p-2 px-4 ${
              formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-black'
            }`}
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.price && formik.errors.price ? (
            <div className="text-red-500">{formik.errors.price}</div>
          ) : null}
        </div>
        <div className="flex w-[310px] flex-col items-start gap-2 rounded-md bg-purple-200 p-4">
          <div className="flex w-full justify-between">
            <span className="font-semibold text-mainColor">
              Commission:
              <Popover content={commissionContent} title="Commission Rates">
                <InfoCircleOutlined className="ml-2 cursor-pointer text-gray-700" />
              </Popover>
            </span>
            <span>€{commission.toFixed(2)}</span>
          </div>
          <div className="flex w-full justify-between">
            <span className="font-semibold text-mainColor">Net Earnings:</span>
            <span>€{netEarnings.toFixed(2)}</span>
          </div>
        </div>
        <select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-80 rounded-full border border-black p-2 px-4">
          <option value="Painting">Painting</option>
          <option value="Sculpture">Sculpture</option>
          <option value="Literature">Literature</option>
        </select>
        {formik.touched.category && formik.errors.category ? (
          <div className="text-red-500">{formik.errors.category}</div>
        ) : null}
        <textarea
          name="about"
          className="w-80 rounded-2xl border border-black p-2 px-4"
          placeholder="About"
          value={formik.values.about}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          name="weight"
          className={`w-80 rounded-full border border-black p-2 px-4 ${
            formik.touched.weight && formik.errors.weight ? 'border-red-500' : 'border-black'
          }`}
          value={formik.values.weight}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.weight && formik.errors.weight ? (
          <div className="text-red-500">{formik.errors.weight}</div>
        ) : null}

        <div className="flex w-4/5 gap-4">
          <input
            type="number"
            placeholder="Length (cm)"
            name="size.length"
            className={`w-1/3 rounded-full border border-black p-2 px-3 ${
              formik.touched.size?.length && formik.errors.size?.length
                ? 'border-red-500'
                : 'border-black'
            }`}
            value={formik.values.size.length}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <input
            type="number"
            placeholder="Width (cm)"
            name="size.width"
            className={`w-1/3 rounded-full border border-black p-2 px-3 ${
              formik.touched.size?.width && formik.errors.size?.width
                ? 'border-red-500'
                : 'border-black'
            }`}
            value={formik.values.size.width}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          <input
            type="number"
            placeholder="Height (cm)"
            name="size.height"
            className={`w-1/3 rounded-full border border-black p-2 px-3 ${
              formik.touched.size?.height && formik.errors.size?.height
                ? 'border-red-500'
                : 'border-black'
            }`}
            value={formik.values.size.height}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
        </div>
        {formik.touched.size &&
        (formik.errors.size?.length || formik.errors.size?.width || formik.errors.size?.height) ? (
          <div className="text-red-500">Please enter valid dimensions</div>
        ) : null}

        <label className="inline-flex w-full cursor-pointer justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto">
          Upload Images
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
        {formik.touched.images && formik.errors.images ? (
          <div className="text-red-500">{formik.errors.images}</div>
        ) : null}
        <div className={getImageContainerClass(images.length)}>
          <Image.PreviewGroup>
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="rounded-md"
                  style={
                    images.length === 1
                      ? { width: '315px', maxHeight: '315px', objectFit: 'cover' }
                      : { width: '150px', maxHeight: '150px', objectFit: 'cover' }
                  }
                />
                <CloseOutlined
                  className="absolute right-1 top-1 cursor-pointer rounded-full bg-mainColor p-1 text-sm text-white"
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
          </Image.PreviewGroup>
        </div>
      </form>
    </Modal>
  );
};

AddArtworkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onArtworkUpdate: PropTypes.func,
  onClose: PropTypes.func.isRequired
};
