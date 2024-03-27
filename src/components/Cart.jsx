import React, { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import ArtworkCard from './ArtworkCard';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      // Make a GET request to fetch cart items
      const response = await fetch('http://localhost:8000/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
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

  return (
    <>
      <Navbar />
      <div className="m-auto grid max-w-screen-2xl grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cartItems.map((item) => (
          <ArtworkCard
            key={item._id}
            artwork={item.artwork_id}
            handleReadMore={() => {}}
            openArtworkEditModal={() => {}}
            handleDeleteArtwork={() => {}}
            showBuyButton={false}
            showEditButton={false}
            showDeleteButton={true}
          />
        ))}
      </div>
    </>
  );
};

export default Cart;
