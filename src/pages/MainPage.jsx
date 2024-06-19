import React, { useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Navbar } from '../components/common/Navbar';
import { ArtworkDetailModal } from '../components/artwork/ArtworkDetailModal';
import { ArtworkCard } from '../components/artwork/ArtworkCard';
import { useCategory } from '../contexts/CategoryContext';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { InputNumber, Button, Select } from 'antd';
import Footer from '../components/common/Footer';
const { Option } = Select;

export const MainPage = () => {
  const { currentUser } = useContext(UserContext);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [minPrice, setMinPrice] = useState(0); // Default minPrice is 0
  const [maxPrice, setMaxPrice] = useState(100000); // Default maxPrice is 100000
  const [sortOrder, setSortOrder] = useState(); // Default sorting order

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

  const fetchArtworks = async (page, minPrice, maxPrice, sortOrder, limit = 10) => {
    try {
      let url = `http://localhost:8000/api/artworks?page=${page}&limit=${limit}`;

      if (minPrice !== 0) {
        url += `&minPrice=${minPrice}`;
      }
      if (maxPrice !== 100000) {
        url += `&maxPrice=${maxPrice}`;
      }
      if (sortOrder) {
        url += `&sortOrder=${sortOrder}`;
      }

      const response = await fetch(url);

      if (response.ok) {
        const artworksData = await response.json();
        console.log(`Fetched Artworks Data:`, artworksData); // Debugging log
        const verifiedArtworks = artworksData.filter((artwork) => artwork.status === 'Verified');

        // If it's the first page, reset artworks state
        if (page === 1) {
          setArtworks(verifiedArtworks);
        } else {
          // Append new artworks to existing artworks state
          setArtworks((prevArtworks) => {
            const newArtworks = verifiedArtworks.filter(
              (newArtwork) => !prevArtworks.some((artwork) => artwork._id === newArtwork._id)
            );
            return [...prevArtworks, ...newArtworks];
          });
        }

        if (verifiedArtworks.length < limit) {
          setHasMore(false);
        }
      } else {
        console.error('Failed to fetch artworks');
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  useEffect(() => {
    fetchArtworks(page, minPrice, maxPrice, sortOrder);
  }, [page, minPrice, maxPrice, sortOrder]);

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
    fetchArtworks(1, minPrice, maxPrice, sortOrder); // Refetch first page
  };

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(100000);
    setSortOrder();
    setPage(1); // Reset page to 1 when clearing filters
    setHasMore(true); // Ensure infinite scroll works properly after clearing filters
    fetchArtworks(1, 0, 100000, ''); // Fetch artworks with default parameters after clearing filters
  };

  const filteredArtworks = artworks
    .filter((artwork) =>
      selectedCategory === 'All'
        ? artwork.createdBy !== currentUser
        : artwork.category === selectedCategory &&
          artwork.createdBy !== currentUser &&
          artwork.status === 'Verified'
    )
    .filter((artwork) => {
      if (minPrice !== 0 && artwork.price < minPrice) return false;
      if (maxPrice !== 100000 && artwork.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else if (sortOrder === 'desc') {
        return b.price - a.price;
      } else {
        // Default sorting by createdAt date (backend handles this)
        return 0; // No additional sorting needed on frontend
      }
    });

  // Determine if there are no artworks to display after filtering
  const noArtworksToDisplay = artworks.length > 0 && filteredArtworks.length === 0;

  return (
    <>
      <Navbar onArtworkUpdate={handleArtworkUpdate} />

      <div className="m-auto max-w-screen-2xl">
        <div className="flex space-x-4 pl-8 pt-6">
          <div className="flex items-center gap-2">
            <InputNumber
              placeholder="Min Price"
              addonAfter="€"
              min={0}
              max={100000}
              value={minPrice}
              onChange={(value) => setMinPrice(value)}
              className="w-32"
            />
            <div className="w-4 border-b border-gray-300"></div>
            <InputNumber
              placeholder="Max Price"
              addonAfter="€"
              min={0}
              max={100000}
              value={maxPrice}
              onChange={(value) => setMaxPrice(value)}
              className="w-32"
            />
          </div>
          <Select
            value={sortOrder}
            placeholder="Sort by price"
            onChange={(value) => setSortOrder(value)}
            className="">
            <Option value="asc">Asc</Option>
            <Option value="desc">Desc</Option>
          </Select>
          <Button
            type="danger"
            onClick={clearFilters}
            className="rounded-md bg-red-500 px-8 py-1 text-white">
            Clear Filters
          </Button>
        </div>

        <InfiniteScroll
          dataLength={filteredArtworks.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore && !noArtworksToDisplay} // Adjusted hasMore based on noArtworksToDisplay
          loader={<h4 className="pl-8">Loading...</h4>}
          endMessage={
            noArtworksToDisplay ? (
              <p className="pb-6 text-center">No artworks to display</p>
            ) : (
              <p className="pb-6 text-center">
                <b>Yay! You have seen it all</b>
              </p>
            )
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
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
