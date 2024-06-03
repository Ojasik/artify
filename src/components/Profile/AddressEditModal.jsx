import React, { useRef, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { UserContext } from '../../contexts/UserContext';

const AddressEditModal = ({ isOpen, onClose }) => {
  const cancelButtonRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    apartment: ''
  });
  const { userId } = useContext(UserContext);

  useEffect(() => {
    fetchAddress();
    fetchCountries();
  }, []);

  const fetchAddress = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}/address`);
      if (response.ok) {
        const addressData = await response.json();
        setFormData(addressData);
        console.log(addressData);
      } else {
        console.error('Failed to fetch address');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users/add-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, userId })
      });
      if (response.ok) {
        onClose();
      } else {
        console.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
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
          onClick={handleFormSubmit}>
          Save
        </button>
      ]}>
      <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="address" className="block pl-4 text-sm font-medium text-mainColor">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
            placeholder="Address"
            required
          />
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="city" className="block pl-4 text-sm font-medium text-mainColor">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
            placeholder="City"
            required
          />
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="postalCode" className="block pl-4 text-sm font-medium text-mainColor">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
            placeholder="Postal Code"
            required
          />
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="country" className="block pl-4 text-sm font-medium text-mainColor">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
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
        </div>
        <div className="flex flex-col items-start pb-4">
          <label htmlFor="apartment" className="block pl-4 text-sm font-medium text-mainColor">
            Apartment
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
            placeholder="Apartment"
          />
        </div>
      </form>
    </Modal>
  );
};

AddressEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default AddressEditModal;
