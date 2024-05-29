import React, { useState, useEffect, useContext } from 'react';
import { Navbar } from '../common/Navbar';
import { useParams } from 'react-router-dom';
import { EditModal } from '../EditModal';
import { ArtworkDetailModal } from '../artwork/ArtworkDetailModal';
import { UserCard } from './UserCard';
import ProfilePagesLinks from './ProfilePageLinks';
import { ArtworkEditModal } from '../artwork/ArtworkEditModal';
import { ArtworkCard } from '../artwork/ArtworkCard';
import { Pagination } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import { ClipLoader } from 'react-spinners';
import { Select, Input, DatePicker, InputNumber } from 'antd';
const { RangePicker } = DatePicker;

import './Select.css';

const { Option } = Select;

const profilePages = [
  { name: 'Artworks', href: '#', current: true },
  { name: 'Likes', href: '#', current: false },
  { name: 'Following', href: '#', current: false },
  { name: 'Followers', href: '#', current: false },
  { name: 'My Orders', href: '#', current: false }
];

export const Profile = () => {
  const { username: profileUsername } = useParams();
  const { currentUser } = useContext(UserContext);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArtworkEditModalOpen, setIsArtworkEditModalOpen] = useState(false);
  const [selectedArtworkForEdit, setSelectedArtworkForEdit] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage, setArtworksPerPage] = useState(4);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState([]); // State for selected status
  const [selectedSortOrder, setSelectedSortOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleReadMore = (artworkDetails) => {
    setSelectedArtworkDetails(artworkDetails);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedArtworkDetails(null);
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedSortOrder(null);
    setSelectedCategory([]);
    setSearchQuery('');
    setPriceRange([0, 100000]);
    setDateRange([null, null]);
  };

  const handleEditModalClose = () => {
    setIsArtworkEditModalOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const openArtworkEditModal = (artwork) => {
    setSelectedArtworkForEdit(artwork);
    setIsArtworkEditModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setArtworksPerPage(4); // Desktop view
      } else {
        setArtworksPerPage(3); // Mobile view
      }
    };

    // Listen to resize events
    window.addEventListener('resize', handleResize);

    // Initial call to set artworksPerPage
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/profile/${profileUsername}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error during profile data fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profileUsername]);

  const fetchUserArtworks = async (page = 1) => {
    setLoadingArtworks(true);
    try {
      if (userProfile.username) {
        let apiUrl = `http://localhost:8000/api/artworks/user/${userProfile.username}?page=${page}&limit=${artworksPerPage}`;

        // Add filters and sorting options
        if (selectedStatus) {
          apiUrl += `&status=${selectedStatus}`;
        }
        if (selectedSortOrder) {
          apiUrl += `&sort=${selectedSortOrder}`;
        }
        if (selectedCategory) {
          apiUrl += `&category=${selectedCategory}`;
        }
        if (searchQuery) {
          apiUrl += `&search=${searchQuery}`;
        }
        if (priceRange) {
          apiUrl += `&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
        }
        if (dateRange[0] && dateRange[1]) {
          apiUrl += `&startDate=${dateRange[0].toISOString()}&endDate=${dateRange[1].toISOString()}`;
        }

        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setUserArtworks(data.artworks);
          setTotalArtworks(data.total);
        } else {
          console.error('Failed to fetch user artworks');
        }
      }
    } catch (error) {
      console.error('Error fetching user artworks:', error);
    } finally {
      setLoadingArtworks(false);
    }
  };

  useEffect(() => {
    fetchUserArtworks(currentPage);
  }, [
    userProfile.username,
    currentPage,
    selectedStatus,
    selectedSortOrder,
    selectedCategory,
    searchQuery,
    priceRange,
    dateRange
  ]);

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/artworks/${artworkId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setUserArtworks((prevArtworks) =>
          prevArtworks.filter((artwork) => artwork._id !== artworkId)
        );
        setTotalArtworks((prevTotal) => prevTotal - 1);
      } else {
        console.error('Failed to delete artwork');
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleProfileUpdate = () => {
    fetchProfileData();
  };

  const handleArtworkUpdate = () => {
    fetchUserArtworks(currentPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar onArtworkUpdate={handleArtworkUpdate} />
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
          initialProfileData={userProfile}
        />
      )}
      <div className="mx-auto flex max-w-screen-2xl flex-col justify-between gap-20 px-8 sm:flex-row">
        <UserCard userProfile={userProfile} openEditModal={openEditModal} />
        <div className="flex w-full flex-col items-center sm:items-start">
          <ProfilePagesLinks profilePages={profilePages} />
          <>
            {/* First row */}
            <div className="mb-4 flex items-start gap-4">
              <Select
                value={selectedStatus}
                placeholder="Select status"
                onChange={(value) => setSelectedStatus(value)}
                mode="multiple"
                className="w-32">
                <Option value="Uploaded">Uploaded</Option>
                <Option value="Verified">Verified</Option>
                <Option value="Sold">Sold</Option>
              </Select>
              <Select
                value={selectedSortOrder}
                placeholder="Sort by price"
                onChange={(value) => setSelectedSortOrder(value)}>
                <Option value="asc">Price: Low to High</Option>
                <Option value="desc">Price: High to Low</Option>
              </Select>
              <Select
                value={selectedCategory}
                placeholder="Select category"
                onChange={(value) => setSelectedCategory(value)}
                mode="multiple"
                className="w-36">
                <Option value="Painting">Painting</Option>
                <Option value="Sculpture">Sculpture</Option>
                <Option value="Photography">Photography</Option>
              </Select>
              <Input
                placeholder="Search artworks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72"
              />
            </div>

            {/* Second row */}
            <div className="flex items-start gap-4">
              <RangePicker
                value={dateRange}
                onChange={(range) => setDateRange(range)}
                placeholder={['Start Date', 'End Date']}
              />
              <div className="flex items-center gap-2">
                <InputNumber
                  min={0}
                  max={100000}
                  value={priceRange[0]}
                  onChange={(value) => setPriceRange([value, priceRange[1]])}
                  placeholder="Min Price"
                  addonAfter="€"
                  className="w-28"
                />
                <div className="w-4 border-b border-gray-300"></div>
                <InputNumber
                  min={0}
                  max={100000}
                  value={priceRange[1]}
                  onChange={(value) => {
                    // Ensure that the second price is not larger than the first
                    if (value >= priceRange[0]) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  placeholder="Max Price"
                  addonAfter="€"
                  className="w-28"
                />
              </div>
              <button
                onClick={clearFilters}
                className="mb-4 rounded-md bg-red-500 px-8 py-1 text-white">
                Clear Filters
              </button>
            </div>
          </>

          {loadingArtworks ? (
            <div className="flex h-full w-full items-center justify-center">
              <ClipLoader size={50} color={'#7734e7'} loading={loadingArtworks} />
            </div>
          ) : userArtworks.length === 0 ? (
            <div>There are no artworks</div>
          ) : (
            <>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {userArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork._id}
                    artwork={artwork}
                    handleReadMore={handleReadMore}
                    openArtworkEditModal={openArtworkEditModal}
                    handleDeleteArtwork={handleDeleteArtwork}
                    showBuyButton={userProfile.username !== currentUser}
                    showEditButton={userProfile.username === currentUser}
                    showDeleteButton={userProfile.username === currentUser}
                  />
                ))}
              </div>
              <Pagination
                count={Math.ceil(totalArtworks / artworksPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                className="mt-2"
              />
            </>
          )}
        </div>
      </div>
      <ArtworkDetailModal
        isOpen={isDetailsModalOpen}
        onClose={handleDetailsModalClose}
        artworkDetails={selectedArtworkDetails || {}}
        setArtworkDetails={setSelectedArtworkDetails}
      />
      <ArtworkEditModal
        isOpen={isArtworkEditModalOpen}
        onClose={handleEditModalClose}
        artwork={selectedArtworkForEdit || {}}
        updateArtworks={handleArtworkUpdate}
      />
    </>
  );
};
