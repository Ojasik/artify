import React, { useState, useEffect } from 'react';
import { Navbar } from '../navbar';
import { useParams } from 'react-router-dom';
import { Editmodal } from '../editmodal';
import { ArtworkDetailsModal } from '../artworkdetailmodal';
import UserCard from './UserCard';
import ProfilePagesLinks from './ProfilePageLinks';
import ArtworkEditModal from '../artworkeditmodal';
import ArtworkCard from '../ArtworkCard';

const profilePages = [
  { name: 'On sale', href: '#', current: true },
  { name: 'Sold', href: '#', current: false },
  { name: 'Likes', href: '#', current: false },
  { name: 'Following', href: '#', current: false },
  { name: 'Followers', href: '#', current: false },
  { name: 'My Orders', href: '#', current: false }
];

export const Profile = () => {
  const { username: profileUsername } = useParams();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedArtworkDetails, setSelectedArtworkDetails] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArtworkEditModalOpen, setIsArtworkEditModalOpen] = useState(false);
  const [selectedArtworkForEdit, setSelectedArtworkForEdit] = useState(null);

  const handleReadMore = (artworkDetails) => {
    setSelectedArtworkDetails(artworkDetails);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedArtworkDetails(null);
  };

  const handleEditModalClose = () => {
    setIsArtworkEditModalOpen(false);
    // setSelectedArtworkForEdit(null);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const openArtworkEditModal = (artwork) => {
    setSelectedArtworkForEdit(artwork);
    setIsArtworkEditModalOpen(true);
  };

  const [userArtworks, setUserArtworks] = useState([]);

  // Fetch user profile data from server when component is rendered
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/profile/${profileUsername}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
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

  useEffect(() => {
    const fetchUserArtworks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/artworks/user/${userProfile.username}`
        );
        if (response.ok) {
          const artworks = await response.json();
          setUserArtworks(artworks);
        } else {
          console.error('Failed to fetch user artworks');
        }
      } catch (error) {
        console.error('Error fetching user artworks:', error);
      }
    };

    // Fetch artworks only if the userProfile is available and has a username
    if (userProfile && userProfile.username) {
      fetchUserArtworks();
    }
  }, [userProfile]);

  const handleProfileUpdate = () => {
    fetchProfileData();
  };

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/artworks/${artworkId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Remove the deleted artwork from the UI
        setUserArtworks((prevArtworks) =>
          prevArtworks.filter((artwork) => artwork._id !== artworkId)
        );
      } else {
        console.error('Failed to delete artwork');
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      {isEditModalOpen && (
        <Editmodal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
          initialProfileData={userProfile}
        />
      )}
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-0 sm:flex-row">
        <UserCard userProfile={userProfile} openEditModal={openEditModal} />
        <div className="max-w-screen flex flex-col items-center sm:items-start">
          <ProfilePagesLinks profilePages={profilePages} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork._id}
                artwork={artwork}
                handleReadMore={handleReadMore}
                openArtworkEditModal={openArtworkEditModal}
                handleDeleteArtwork={handleDeleteArtwork}
              />
            ))}
          </div>
          <ArtworkDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={handleDetailsModalClose}
            artworkDetails={selectedArtworkDetails || {}}
          />
          <ArtworkEditModal
            isOpen={isArtworkEditModalOpen}
            onClose={handleEditModalClose}
            artwork={selectedArtworkForEdit || {}}
            updateArtworks={setUserArtworks}
          />
        </div>
      </div>
    </>
  );
};
