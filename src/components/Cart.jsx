/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Drawer, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const Cart = ({ isOpen, onCancel }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, [onCancel]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cart', {
        credentials: 'include'
      });

      if (response.ok) {
        const cartItemsData = await response.json();
        setCartItems(cartItemsData);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleDeleteArtwork = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item._id !== itemId));
        console.log('Artwork deleted from cart successfully');
      } else {
        console.error('Failed to delete artwork from cart');
      }
    } catch (error) {
      console.error('Error deleting artwork from cart:', error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.artwork_id.price, 0).toFixed(2);
  };

  const renderArtworks = () => {
    if (cartItems.length === 0) {
      return <div>Shopping cart is empty</div>;
    }

    return cartItems.map((item, index) => (
      <div key={item._id} className={`py-4 ${index !== 0 ? 'border-t' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={item.artwork_id.images[0].data}
              alt={item.artwork_id.title}
              className="mr-4 h-20 w-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">{item.artwork_id.title}</h3>
              <p className="text-gray-700">{item.artwork_id.price.toFixed(2)} €</p>
              <p className="text-gray-700">{item.artwork_id.createdBy}</p>
            </div>
          </div>
          <CloseOutlined
            className="cursor-pointer text-xl text-red-500 hover:text-red-700"
            onClick={() => handleDeleteArtwork(item._id)}
          />
        </div>
      </div>
    ));
  };

  const handleCheckout = () => {
    const artworks = cartItems.map((item) => item.artwork_id);
    navigate('/order', { state: { artworks } });
  };

  return (
    <>
      <Drawer title="Cart" placement="right" open={isOpen} width={400} onClose={onCancel}>
        <div>{renderArtworks()}</div>
        {cartItems.length > 0 && (
          <div className="mt-auto border-t pt-4">
            <div className="mb-2 flex justify-between">
              <span>Subtotal</span>
              <span>{calculateSubtotal()} €</span>
            </div>
            <div className="mb-2 text-gray-700">Shipping calculated at checkout</div>
            <Button type="primary" block disabled={cartItems.length === 0} onClick={handleCheckout}>
              CHECK OUT
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Cart;
