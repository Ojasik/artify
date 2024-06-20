import React, { useState, useEffect, useContext } from 'react';
import Footer from '../common/Footer';
import { Navbar } from '../common/Navbar';
import { useParams } from 'react-router-dom';
import { EditModal } from './EditModal';
import { ArtworkDetailModal } from '../artwork/ArtworkDetailModal';
import { UserCard } from './UserCard';
import ProfilePagesLinks from './ProfilePageLinks';
import { ArtworkEditModal } from '../artwork/ArtworkEditModal';
import { ArtworkCard } from '../artwork/ArtworkCard';
import { Pagination } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import { ClipLoader } from 'react-spinners';
import OrderCard from '../order/OrderCard';
import Filter from '../filter/FIlter';

export const Profile = () => {
  const [selectedPage, setSelectedPage] = useState('Artworks');
  const { username: profileUsername } = useParams();
  const { currentUser } = useContext(UserContext);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArtworkEditModalOpen, setIsArtworkEditModalOpen] = useState(false);
  const [selectedArtworkForEdit, setSelectedArtworkForEdit] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage, setArtworksPerPage] = useState(4);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [ordersPerPage, setOrdersPerPage] = useState(4);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedSortOrder, setSelectedSortOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [userOrders, setUserOrders] = useState([]);

  const profilePages = [
    { name: 'Artworks', href: '#', current: selectedPage === 'Artworks' },
    { name: 'My Orders', href: '#', current: selectedPage === 'My Orders' }
  ];

  const handleSelectedPageChange = (pageName) => {
    setSelectedPage(pageName);
  };

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
        setOrdersPerPage(4);
      } else {
        setArtworksPerPage(3);
        setOrdersPerPage(3); // Mobile view
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
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [profileUsername]);

  useEffect(() => {
    fetchUserOrders(currentOrdersPage);
  }, [currentOrdersPage]);

  const fetchUserOrders = async (page = 1) => {
    setLoadingOrders(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/orders-profile?page=${page}&limit=${ordersPerPage}`,
        {
          credentials: 'include'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserOrders(data.orders);
        setTotalOrders(data.total);
      } else {
        console.error('Failed to fetch user orders');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUserArtworks = async (page = 1) => {
    setLoadingArtworks(true);
    try {
      if (userProfile.username) {
        let apiUrl = `http://localhost:8000/api/artworks/user/${userProfile.username}?page=${page}&limit=${artworksPerPage}`;

        if (userProfile.username !== currentUser) {
          // If the user is not the owner, only fetch artworks with status "Verified"
          apiUrl += `&status=Verified`;
        } else {
          // If the user is the owner, fetch all artworks
          if (selectedStatus) {
            apiUrl += `&status=${selectedStatus}`;
          }
        }
        // Add filters and sorting options

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
    setCurrentOrdersPage(page);
  };

  const handleProfileUpdate = () => {
    fetchProfileData();
  };

  const handleArtworkUpdate = () => {
    fetchUserArtworks(currentPage);
  };

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
          {currentUser === profileUsername ? (
            <ProfilePagesLinks
              profilePages={profilePages}
              onPageChange={handleSelectedPageChange}
            />
          ) : (
            <div style={{ height: '50px' }}></div>
          )}
          {selectedPage === 'Artworks' && (
            <Filter
              userProfile={userProfile}
              currentUser={currentUser}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedSortOrder={selectedSortOrder}
              setSelectedSortOrder={setSelectedSortOrder}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              dateRange={dateRange}
              setDateRange={setDateRange}
              clearFilters={clearFilters}
            />
          )}

          {selectedPage === 'Artworks' ? (
            loadingArtworks ? (
              <div className="flex h-full w-full items-center justify-center">
                <ClipLoader size={50} color={'#7734e7'} loading={loadingArtworks} />
              </div>
            ) : userArtworks.length === 0 ? (
              <div>There are no artworks</div>
            ) : (
              <>
                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {userArtworks.map((artwork) => (
                    <div key={artwork._id}>
                      <ArtworkCard
                        artwork={artwork}
                        handleReadMore={handleReadMore}
                        openArtworkEditModal={openArtworkEditModal}
                        handleDeleteArtwork={handleDeleteArtwork}
                        showBuyButton={userProfile.username !== currentUser}
                        showEditButton={userProfile.username === currentUser}
                        showDeleteButton={userProfile.username === currentUser}
                      />
                    </div>
                  ))}
                </div>
                <Pagination
                  count={Math.ceil(totalArtworks / artworksPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  className="mt-4"
                />
              </>
            )
          ) : (
            <>
              {loadingOrders ? (
                <div className="flex h-full w-full items-center justify-center">
                  <ClipLoader size={50} color={'#7734e7'} loading={loadingOrders} />
                </div>
              ) : userOrders.length === 0 ? (
                <div className="my-4 text-center">No orders to display</div>
              ) : (
                <>
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userOrders.map((order) => (
                      <div key={order._id}>
                        <OrderCard order={order} onUpdate={fetchUserOrders} />
                      </div>
                    ))}
                  </div>
                  <Pagination
                    count={Math.ceil(totalOrders / ordersPerPage)}
                    page={currentOrdersPage}
                    onChange={(event, page) => setCurrentOrdersPage(page)}
                    className="mt-4"
                  />
                </>
              )}
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
      <Footer />
    </>
  );
};
