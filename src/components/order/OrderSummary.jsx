/* eslint-disable react/prop-types */
import React from 'react';

const OrderSummary = ({ artwork, shippingCost }) => {
  if (!artwork) return null;

  const roundedShippingCost = shippingCost.toFixed(2);
  const totalCost = (artwork.price + parseFloat(roundedShippingCost)).toFixed(2);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">Order Summary</h2>
      <div className="mb-4 flex items-center">
        <img
          src={artwork.images[0].data}
          alt={artwork.title}
          className="mr-4 h-20 w-20 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{artwork.title}</h3>
          <p className="text-gray-700">${artwork.price}</p>
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span>{artwork.price} €</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span>Shipping</span>
          <span>{roundedShippingCost} €</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{totalCost} €</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
