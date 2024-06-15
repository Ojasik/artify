import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

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

  const fetchArtworks = async (page, limit = 10) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/artworks?page=${page}&limit=${limit}`
      );
      if (response.ok) {
        const artworksData = await response.json();
        console.log(`Fetched Artworks Data:`, artworksData); // Debugging log
        const verifiedArtworks = artworksData.filter((artwork) => artwork.status === 'Verified');

        setArtworks((prevArtworks) => {
          // Ensure no duplicates
          const newArtworks = verifiedArtworks.filter(
            (newArtwork) => !prevArtworks.some((artwork) => artwork._id === newArtwork._id)
          );
          return [...prevArtworks, ...newArtworks];
        });

        if (verifiedArtworks.length < limit) {
          setHasMore(false);
        }

        // Check if initial load has insufficient artworks for scrolling
        if (initialLoad) {
          setInitialLoad(false);
          const totalHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;
          if (totalHeight <= windowHeight) {
            setPage((prevPage) => prevPage + 1);
          }
        }
      } else {
        console.error('Failed to fetch artworks');
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  useEffect(() => {
    console.log(`Artworks State:`, artworks); // Debugging log
  }, [artworks]);

  const handleReadMore = (artworkDetails) => {
    setSelectedArtworkDetails(artworkDetails);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedArtworkDetails(null);
  };

  const handleArtworkUpdate = () => {
    setArtworks([]);
    setPage(1);
    setHasMore(true);
    fetchArtworks(1); // Refetch first page
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

      <InfiniteScroll
        dataLength={artworks.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }>
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
      </InfiniteScroll>

      <ArtworkDetailModal
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        artworkDetails={selectedArtworkDetails || {}}
      />
    </>
  );
};
