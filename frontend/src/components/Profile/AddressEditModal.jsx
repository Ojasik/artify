import React, { useRef, useState, useEffect, useContext } from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { UserContext } from '../../contexts/UserContext';

const AddressEditModal = ({ isOpen, onClose }) => {
  const cancelButtonRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const { userId } = useContext(UserContext);

  // Yup validation schema
  const validationSchema = yup.object({
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    postalCode: yup.string().required('Postal Code is required'),
    country: yup.string().required('Country is required'),
    apartment: yup.string().optional()
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      address: '',
      city: '',
      postalCode: '',
      country: '',
      apartment: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:8000/api/users/add-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, userId })
        });
        if (response.ok) {
          onClose();
        } else {
          console.error('Failed to add address');
        }
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/shippingrates');
      if (response.ok) {
        const shippingRates = await response.json();
        const uniqueCountries = [...new Set(shippingRates.map((rate) => rate.country))];
        setCountries(uniqueCountries);
      } else {
        console.error('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  return (
    <Modal
      title="Edit Address"
      visible={isOpen}
      onCancel={onClose}
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
      <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="address" className="block pl-4 text-sm font-medium text-mainColor">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full rounded-full border p-2 px-4 ${
              formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-black'
            }`}
            required
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500">{formik.errors.address}</div>
          ) : null}
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="city" className="block pl-4 text-sm font-medium text-mainColor">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full rounded-full border p-2 px-4 ${
              formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-black'
            }`}
            required
          />
          {formik.touched.city && formik.errors.city ? (
            <div className="text-red-500">{formik.errors.city}</div>
          ) : null}
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="postalCode" className="block pl-4 text-sm font-medium text-mainColor">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full rounded-full border p-2 px-4 ${
              formik.touched.postalCode && formik.errors.postalCode
                ? 'border-red-500'
                : 'border-black'
            }`}
            required
          />
          {formik.touched.postalCode && formik.errors.postalCode ? (
            <div className="text-red-500">{formik.errors.postalCode}</div>
          ) : null}
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="country" className="block pl-4 text-sm font-medium text-mainColor">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full rounded-full border p-2 px-4 ${
              formik.touched.country && formik.errors.country ? 'border-red-500' : 'border-black'
            }`}
            required>
            <option value="" disabled>
              Select Country
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {formik.touched.country && formik.errors.country ? (
            <div className="text-red-500">{formik.errors.country}</div>
          ) : null}
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="apartment" className="block pl-4 text-sm font-medium text-mainColor">
            Apartment
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formik.values.apartment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full rounded-full border p-2 px-4 ${
              formik.touched.apartment && formik.errors.apartment
                ? 'border-red-500'
                : 'border-black'
            }`}
          />
          {formik.touched.apartment && formik.errors.apartment ? (
            <div className="text-red-500">{formik.errors.apartment}</div>
          ) : null}
        </div>
      </form>
    </Modal>
  );
};

export default AddressEditModal;
