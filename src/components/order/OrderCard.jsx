import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OrderDetailModal from './OrderDetailModal';

const truncateID = (id, maxLength) => {
  if (id.length <= maxLength) return id;
  return id.substring(0, maxLength) + '...';
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-200 text-yellow-800';
    case 'Processing':
      return 'bg-blue-200 text-blue-800';
    case 'Shipped':
      return 'bg-green-200 text-green-800';
    case 'Delivered':
      return 'bg-purple-200 text-purple-800';
    case 'Cancelled':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const OrderCard = ({ order, onUpdate }) => {
  const { _id, createdAt, status, totalPrice } = order;

  const [modalVisible, setModalVisible] = useState(false);

  const handleViewDetails = () => {
    setModalVisible(true);
  };

  return (
    <div className="rounded-xl border shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="px-4 py-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Order ID: {truncateID(_id, 10)}</h2>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-gray-600">Date: </span>
          <span className="text-gray-600">{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-gray-600">Total Price:</span>
          <span className="ml-2 font-semibold">{totalPrice.toFixed(2)} €</span>
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={handleViewDetails}
            className="w-full rounded-full border border-mainColor  py-1 text-sm font-semibold text-mainColor transition-colors duration-300 hover:bg-mainColor hover:text-white">
            View Details
          </button>
        </div>
      </div>
      <div
        className={`rounded-b-xl px-4 py-2 text-center font-semibold ${getStatusStyles(status)}`}>
        {status}
      </div>
      <OrderDetailModal
        orderDetails={order}
        visible={modalVisible}
        onUpdate={onUpdate}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default OrderCard;
