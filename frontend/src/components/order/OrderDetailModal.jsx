import React, { useState, useEffect, useContext } from 'react';
import { Modal, message, Popconfirm } from 'antd';
import { UserContext } from '../../contexts/UserContext';

const OrderDetailModal = ({ orderDetails, visible, onClose, onUpdate }) => {
  if (!orderDetails) return null;
  const [selectedStatus, setSelectedStatus] = useState(orderDetails ? orderDetails.status : '');
  const { role } = useContext(UserContext);
  const [paymentCompleted, setPaymentCompleted] = useState({});

  useEffect(() => {
    // Initialize paymentCompleted state based on orderDetails
    const initialPaymentStatus = {};
    orderDetails.artworks.forEach((artwork) => {
      initialPaymentStatus[artwork._id] = artwork.status === 'Sold';
    });
    setPaymentCompleted(initialPaymentStatus);
  }, [orderDetails]);

  const {
    _id: orderId,
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
    apartment,
    createdAt
  } = orderDetails;

  const calculateSubtotal = () => {
    return totalPrice - shippingCost;
  };

  const renderArtworks = () => {
    return artworks.map((artwork, index) => (
      <div key={index} className="mb-4 flex items-center justify-between">
        <div className="mb-4 flex items-center">
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
        {(role === 'Admin' || role === 'Moderator') &&
          !paymentCompleted[artwork._id] &&
          selectedStatus !== 'Cancelled' && ( // Check if payment is not completed
            <button
              className="rounded-full border border-mainColor px-3 font-semibold text-black transition-colors duration-300 hover:bg-mainColor hover:text-white"
              onClick={() => handleSendMoney(artwork)}>
              Send Money
            </button>
          )}
      </div>
    ));
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'Processing':
        return 'bg-orange-200 text-orange-800';
      case 'Shipped':
        return 'bg-green-200 text-green-800';
      case 'Delivered':
        return 'bg-purple-200 text-purple-800';
      case 'Cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return '';
    }
  };

  const handleSendMoney = async (artwork) => {
    try {
      const response = await fetch(`https://artify-backend-0eef31091a04.herokuapp.com/api/orders/send-money/${artwork._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const updatedPaymentStatus = { ...paymentCompleted };
        updatedPaymentStatus[artwork._id] = true;
        setPaymentCompleted(updatedPaymentStatus);
        message.success('Money sent successfully');
        // Additional logic if needed after sending money
      } else {
        message.error('Failed to send money');
      }
    } catch (error) {
      console.error('Error sending money:', error);
      message.error('Failed to send money');
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(
        `https://artify-backend-0eef31091a04.herokuapp.com/api/orders/update-order-status/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'Cancelled' })
        }
      );

      if (response.ok) {
        message.success('Order cancelled successfully');
        onUpdate();
        onClose();
      } else {
        message.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      message.error('Failed to cancel order');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://artify-backend-0eef31091a04.herokuapp.com/api/orders/update-order-status/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ status: selectedStatus })
        }
      );

      if (response.ok) {
        message.success('Order status updated successfully');
        onUpdate();
        onClose();
      } else {
        message.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const hasSentMoney = Object.values(paymentCompleted).some((status) => status);

  return (
    <Modal
      title={`Order Details - ${orderId}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <div className="flex items-center justify-between text-base" key="footer-content">
          <div key="created-at" className="flex items-center text-gray-600">
            <p className="mr-4 mt-3 text-base">
              <span className="text-base font-semibold">Created At:</span>{' '}
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            {(role === 'Admin' || role === 'Moderator') &&
              !hasSentMoney &&
              selectedStatus !== 'Cancelled' && (
                <Popconfirm
                  title="Are you sure you want to cancel this order?"
                  onConfirm={handleCancelOrder}
                  okText="Yes"
                  cancelText="No">
                  <button
                    key="cancelOrder"
                    className="mr-3 inline-flex justify-center rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto">
                    Cancel Order
                  </button>
                </Popconfirm>
              )}
            {(role === 'Admin' || role === 'Moderator') && (
              <>
                <button
                  key="cancel"
                  className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={onClose}>
                  Cancel
                </button>
                <button
                  key="save"
                  className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
                  onClick={handleSubmit}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      ]}
      width={800}>
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
            <div className="flex items-start">
              <h2 className="mb-4 text-xl font-semibold">
                Order Details
                <span
                  className={`ml-4 rounded-md p-1 text-xl ${getStatusStyles(orderDetails.status)}`}>
                  {orderDetails.status}
                </span>
              </h2>
            </div>
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
              {(role === 'Admin' || role === 'Moderator') && selectedStatus !== 'Cancelled' && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-md pb-2 font-medium">Order Status</h3>
                  <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="mt-2 w-full rounded-md border border-gray-300 p-2">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
