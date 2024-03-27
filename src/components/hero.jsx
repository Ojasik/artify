import React, { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import ArtworkCard from './ArtworkCard';
import { ArtworkDetailsModal } from './artworkdetailmodal';

export const Hero = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const addToCart = async (artworkId) => {
    try {
      const response = await fetch('http://localhost:8000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ artwork_id: artworkId })
      });

      if (response.ok) {
        console.log('Artwork added to cart successfully');
      } else {
        console.error('Failed to add artwork to cart');
      }
    } catch (error) {
      console.error('Error adding artwork to cart:', error);
    }
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/artworks');
        if (response.ok) {
          const artworksData = await response.json();
          setArtworks(artworksData);
        } else {
          console.error('Failed to fetch artworks');
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  const handleReadMore = (artworkDetails) => {
    setSelectedArtworkDetails(artworkDetails);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedArtworkDetails(null);
  };

  return (
    <>
      <Navbar />
      <div className="m-auto grid max-w-screen-2xl grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork._id}
            artwork={artwork}
            handleReadMore={handleReadMore}
            showBuyButton={true}
            addToCart={addToCart}
          />
        ))}
      </div>
      <ArtworkDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        artworkDetails={selectedArtworkDetails || {}}
      />
    </>
  );
};
