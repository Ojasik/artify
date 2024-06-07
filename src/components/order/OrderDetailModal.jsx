/* eslint-disable react/prop-types */
import React from 'react';
import { Modal } from 'antd';

const OrderDetailModal = ({ orderDetails, visible, onClose }) => {
  if (!orderDetails) return null;

  const {
    artworks,
    shippingCost,
    totalPrice,
    country,
    city,
    address,
    email,
    phone,
    firstName,
    lastName,
    postalCode,
    apartment
  } = orderDetails;

  const calculateSubtotal = () => {
    return totalPrice - shippingCost;
  };

  const renderArtworks = () => {
    return artworks.map((artwork, index) => (
      <div key={index} className="mb-4 flex items-center">
        <img
          src={artwork.images[0].data}
          alt={artwork.title}
          className="mr-4 h-20 w-20 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold">{artwork.title}</h3>
          <p className="text-gray-700">{artwork.price.toFixed(2)} €</p>
          <p className="text-gray-700">{artwork.createdBy}</p>
        </div>
      </div>
    ));
  };

  return (
    <Modal title="Order Details" visible={visible} onCancel={onClose} footer={null} width={800}>
      <div className="flex">
        {/* Left Side */}
        <div className="w-1/2 pr-4">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Artwork List</h2>
            <div className="mb-4">{renderArtworks()}</div>
            <div className="mt-4 border-t pt-4">
              <div className="mb-2 flex justify-between">
                <span>Subtotal</span>
                <span>{calculateSubtotal().toFixed(2)} €</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="w-1/2 pl-4">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
            <div className="mt-4 border-t pt-4">
              <div className="mb-2">
                <h3 className="text-md pb-2 font-medium">Contact Information</h3>
                <div className="flex flex-col">
                  <span>{email}</span>
                  <span>{phone}</span>
                </div>
              </div>
              <div className="mb-2 mt-4 border-t pt-4">
                <h3 className="text-md pb-2 font-medium">Shipping Address</h3>
                <div className="flex flex-col">
                  <span>
                    {firstName} {lastName}
                  </span>
                  <span>
                    {address}, {apartment}
                  </span>
                  <span>
                    {city}, {postalCode}
                  </span>
                  <span>{country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
