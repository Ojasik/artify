import React, { useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const EditModal = ({ isOpen, onClose, onProfileUpdate, initialProfileData }) => {
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    description: Yup.string(),
    website: Yup.string().matches(
      /^(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
      'Website must be in the format www.example.com'
    ),
    x: Yup.string(),
    instagram: Yup.string(),
    facebook: Yup.string(),
    avatar: Yup.string()
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      firstName: initialProfileData?.firstname || '',
      lastName: initialProfileData?.lastname || '',
      description: initialProfileData?.description || '',
      website: initialProfileData?.website || '',
      x: initialProfileData?.x || '',
      instagram: initialProfileData?.instagram || '',
      facebook: initialProfileData?.facebook || '',
      avatar: initialProfileData?.avatar || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('https://artify-backend-0eef31091a04.herokuapp.com/api/users/profile', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Profile updated successfully');
          onProfileUpdate();
          onClose();
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error during profile update:', error);
      }
    }
  });

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      title="Edit profile"
      visible={isOpen}
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
          onClick={formik.handleSubmit}>
          Save
        </button>
      ]}>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="firstName" className="block pl-4 text-sm font-medium text-mainColor">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-full border ${
                formik.touched.firstName && formik.errors.firstName
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-500">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="lastName" className="block pl-4 text-sm font-medium text-mainColor">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-full border ${
                formik.touched.lastName && formik.errors.lastName
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-500">{formik.errors.lastName}</div>
            )}
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="website" className="block pl-4 text-sm font-medium text-mainColor">
              Website
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              className="w-full rounded-full border border-black p-2 px-4"
              placeholder="Website (optional)"
            />
            {formik.touched.website && formik.errors.website ? (
              <div className="text-red-500">{formik.errors.website}</div>
            ) : null}
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="x" className="block pl-4 text-sm font-medium text-mainColor">
              X
            </label>
            <input
              type="text"
              id="x"
              name="x"
              value={formik.values.x}
              onChange={formik.handleChange}
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
              value={formik.values.instagram}
              onChange={formik.handleChange}
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
              value={formik.values.facebook}
              onChange={formik.handleChange}
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
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full rounded-2xl border border-black p-2 px-4"
              placeholder="Description (optional)"
            />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col items-center justify-center">
              {formik.values.avatar && (
                <span className="h-36 w-36 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={formik.values.avatar}
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
                    {formik.values.avatar && (
                      <button
                        type="button"
                        className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => formik.setFieldValue('avatar', '')}>
                        <CloseOutlined style={{ fontSize: '16px' }} />
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
                {formik.values.avatar && (
                  <button
                    type="button"
                    className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => formik.setFieldValue('avatar', '')}>
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
