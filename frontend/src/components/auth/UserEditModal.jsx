import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../contexts/UserContext';

export const UserEditModal = ({ isOpen, onClose, rowData, onUpdateSuccess }) => {
  const { role } = useContext(UserContext);
  const cancelButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\+?[0-9]+$/, 'Phone number must start with + and contain only digits')
      .min(8, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .required('Phone is required'),
    website: Yup.string().matches(
      /^(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
      'Website must be in the format www.example.com'
    ),
    x: Yup.string(),
    instagram: Yup.string(),
    facebook: Yup.string(),
    description: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      username: rowData.username,
      firstname: rowData.firstname,
      lastname: rowData.lastname,
      email: rowData.email,
      phone: rowData.phone,
      role: rowData.role,
      description: rowData.profile?.description || '',
      website: rowData.profile?.website || '',
      x: rowData.profile?.x || '',
      instagram: rowData.profile?.instagram || '',
      facebook: rowData.profile?.facebook || '',
      avatar: rowData.profile?.avatar || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/user/${rowData._id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          message.success('Profile updated successfully');
          onUpdateSuccess();
          onClose();
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error during profile update:', error);
      }
    }
  });

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

  const handleRoleChange = (e) => {
    formik.handleChange(e);
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
          ref={cancelButtonRef}
          type="button">
          Cancel
        </button>,
        <button
          key="save"
          className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={formik.handleSubmit}
          type="button">
          Save
        </button>
      ]}>
      <form id="editProfileForm" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="firstname" className="block pl-4 text-sm font-medium text-mainColor">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              value={formik.values.firstname}
              onChange={formik.handleChange}
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.firstname && formik.errors.firstname
                  ? 'border-red-500'
                  : 'border-black'
              }`}
              required
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.firstname}</div>
            )}
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="lastname" className="block pl-4 text-sm font-medium text-mainColor">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              placeholder="Last Name"
              name="lastname"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.lastname && formik.errors.lastname
                  ? 'border-red-500'
                  : 'border-black'
              }`}
              required
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.lastname}</div>
            )}
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="email" className="block pl-4 text-sm font-medium text-mainColor">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-black'
              }`}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.email}</div>
            )}
          </div>
          <div className="flex flex-col items-start pb-4">
            <label htmlFor="phone" className="block pl-4 text-sm font-medium text-mainColor">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-black'
              }`}
              required
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.phone}</div>
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
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.website && formik.errors.website ? 'border-red-500' : 'border-black'
              }`}
              placeholder="Website (optional)"
            />
            {formik.touched.website && formik.errors.website && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.website}</div>
            )}
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
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.x && formik.errors.x ? 'border-red-500' : 'border-black'
              }`}
              placeholder="X (optional)"
            />
            {formik.touched.x && formik.errors.x && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.x}</div>
            )}
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
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.instagram && formik.errors.instagram
                  ? 'border-red-500'
                  : 'border-black'
              }`}
              placeholder="Instagram (optional)"
            />
            {formik.touched.instagram && formik.errors.instagram && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.instagram}</div>
            )}
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
              className={`w-full rounded-full border p-2 px-4 ${
                formik.touched.facebook && formik.errors.facebook
                  ? 'border-red-500'
                  : 'border-black'
              }`}
              placeholder="Facebook (optional)"
            />
            {formik.touched.facebook && formik.errors.facebook && (
              <div className="mt-1 text-sm text-red-600">{formik.errors.facebook}</div>
            )}
          </div>
          {role === 'Admin' && (
            <div className="flex flex-col items-start pb-4">
              <label htmlFor="role" className="block pl-4 text-sm font-medium text-mainColor">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={handleRoleChange}
                className={`w-full rounded-full border p-2 px-4 ${
                  formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-black'
                }`}>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Regular">Regular</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className="mt-1 text-sm text-red-600">{formik.errors.role}</div>
              )}
            </div>
          )}
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
                      className="hover sm inline-flex justify-center rounded-full bg-mainColor px-6 py-1 text-sm font-semibold text-white shadow-sm"
                      onClick={() => fileInputRef.current.click()}>
                      Upload Image
                    </button>
                    <button
                      type="button"
                      className="hover ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm
            "
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => formik.setFieldValue('avatar', '')}>
                      <CloseOutlined style={{ fontSize: '16px' }} />
                    </button>
                  </div>
                </span>
              )}
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

export default UserEditModal;
