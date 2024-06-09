/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const ShippingAddressForm = ({ onShippingCostChange, onFormDataChange, artworks }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const { userId, firstname, lastname, phone, email } = useContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: firstname || '',
    lastName: lastname || '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: phone || '',
    email: email || ''
  });

  useEffect(() => {
    fetchCountries();
    fetchAddress();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      calculateShippingCost();
    }
  }, [selectedCountry]);

  useEffect(() => {
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  const fetchAddress = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}/address`);
      if (response.ok) {
        const addressData = await response.json();
        setFormData(addressData);
        setSelectedCountry(addressData.country);
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
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json();
      console.log(data);
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const calculateShippingCost = async () => {
    if (!selectedCountry || !artworks.length) return;

    try {
      let totalShippingCost = 0;

      for (const artwork of artworks) {
        const response = await fetch('http://localhost:8000/api/shippingrates/calculate-shipping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            country: selectedCountry,
            weight: artwork.weight,
            height: artwork.size.height,
            width: artwork.size.width,
            length: artwork.size.length
          })
        });

        if (!response.ok) {
          throw new Error('Failed to calculate shipping cost');
        }

        const data = await response.json();
        totalShippingCost += data.shippingCost;
        console.log(`Shipping cost for artwork ${artwork._id}: ${shippingCost}`);
      }

      setShippingCost(totalShippingCost);

      // Pass the total shipping cost back to the parent component
      onShippingCostChange(totalShippingCost);
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setFormData({ ...formData, country: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Shipping Address</h2>
      <form>
        <div className="mb-4">
          <label className="block pl-4 text-sm font-medium text-mainColor">Country/Region</label>
          <select
            name="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full rounded-full border border-black p-2 px-4">
            <option value="" disabled>
              Select Country
            </option>
            {countries.map((country, index) => (
              <option key={index}>{country.country}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block pl-4 text-sm font-medium text-mainColor">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
            />
          </div>
          <div className="flex-1">
            <label className="block pl-4 text-sm font-medium text-mainColor">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block pl-4 text-sm font-medium text-mainColor">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
          />
        </div>
        <div className="mb-4">
          <label className="block pl-4 text-sm font-medium text-mainColor">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            className="w-full rounded-full border border-black p-2 px-4"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block pl-4 text-sm font-medium text-mainColor">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
            />
          </div>
          <div className="flex-1">
            <label className="block pl-4 text-sm font-medium text-mainColor">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block pl-4 text-sm font-medium text-mainColor">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
            />
          </div>
          <div className="flex-1">
            <label className="block pl-4 text-sm font-medium text-mainColor">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-full border border-black p-2 px-4"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressForm;
