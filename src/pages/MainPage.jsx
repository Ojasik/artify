import React, { useState, useEffect, useContext } from 'react';
import { Navbar } from '../components/common/Navbar';
import { ArtworkDetailModal } from '../components/artwork/ArtworkDetailModal';
import { ArtworkCard } from '../components/artwork/ArtworkCard';
import { useCategory } from '../contexts/CategoryContext';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export const MainPage = () => {
  const { currentUser } = useContext(UserContext);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategory();

  const location = useLocation();

  useEffect(() => {
    // Parse query parameter to extract selected category
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    if (category) {
      setSelectedCategory(category);
    }
  }, [location.search, setSelectedCategory]);

  const addToCart = async (artworkId) => {
    try {
      const response = await fetch('http://localhost:8000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ artwork_id: artworkId })
      });

      if (response.ok) {
        setArtworks((prevArtworks) => prevArtworks.filter((artwork) => artwork._id !== artworkId));
        console.log('Artwork added to cart successfully');
      } else {
        console.error('Failed to add artwork to cart');
      }
    } catch (error) {
      console.error('Error adding artwork to cart:', error);
    }
  };

  const fetchArtworks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/artworks');
      if (response.ok) {
        const artworksData = await response.json();
        const verifiedArtworks = artworksData.filter((artwork) => artwork.status === 'Verified');
        setArtworks(verifiedArtworks);
      } else {
        console.error('Failed to fetch artworks');
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  useEffect(() => {
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

  const handleArtworkUpdate = () => {
    fetchArtworks();
  };

  const filteredArtworks =
    selectedCategory === 'All'
      ? artworks.filter((artwork) => artwork.createdBy !== currentUser)
      : artworks.filter(
          (artwork) =>
            artwork.category === selectedCategory &&
            artwork.createdBy !== currentUser &&
            artwork.status === 'Verified'
        );

  return (
    <>
      <Navbar onArtworkUpdate={handleArtworkUpdate} />

      <div className="m-auto grid max-w-screen-2xl grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard
            key={artwork._id}
            artwork={artwork}
            handleReadMore={handleReadMore}
            showBuyButton={true}
            addToCart={addToCart}
          />
        ))}
      </div>
      <ArtworkDetailModal
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        artworkDetails={selectedArtworkDetails || {}}
      />
    </>
  );
};
