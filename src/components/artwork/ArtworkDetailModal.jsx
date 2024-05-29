import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Image } from 'antd';
import { UserContext } from '../../contexts/UserContext';
import RejectionDrawer from '../RejectionDrawer';

const getImageContainerClass = (numImages) => {
  if (numImages === 2) {
    return 'grid grid-cols-2 gap-4';
  } else if (numImages >= 3) {
    return 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4';
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'Uploaded':
      return 'bg-red-200 text-red-800';
    case 'Verified':
      return 'bg-green-200 text-green-800';
    case 'Sold':
      return 'bg-purple-200 text-mainColor';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export const ArtworkDetailModal = ({
  isOpen,
  onClose,
  artworkDetails,
  setArtworkDetails,
  onUpdate
}) => {
  const { currentUser, role } = useContext(UserContext);
  const [rejectDrawerVisible, setRejectDrawerVisible] = useState(false);

  const containerClassName = getImageContainerClass(
    artworkDetails.images ? artworkDetails.images.length : 0
  );

  const handleReject = () => {
    setRejectDrawerVisible(true);
  };

  const handleCloseRejectDrawer = () => {
    setRejectDrawerVisible(false);
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/artworks/${artworkDetails._id}/verify`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );
      if (response.ok) {
        setArtworkDetails({ ...artworkDetails, status: 'Verified' });
      } else {
        console.error('Failed to verify artwork');
      }
    } catch (error) {
      console.error('Error verifying artwork:', error);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        width={1000}
        footer={[
          <button
            key="close"
            className="mr-3 inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
            onClick={onClose}>
            Close
          </button>,
          (role === 'Moderator' || role === 'Admin') &&
            (artworkDetails.status === 'Uploaded' || artworkDetails.status === 'Verified') && (
              <>
                <button
                  key="reject"
                  className="inline-flex w-full justify-center rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto"
                  onClick={handleReject}>
                  Reject
                </button>
                {artworkDetails.status !== 'Verified' && (
                  <button
                    key="verify"
                    className="inline-flex w-full justify-center rounded-full bg-green-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto"
                    onClick={handleVerify}>
                    Verify
                  </button>
                )}
              </>
            )
        ]}
        destroyOnClose
        title="Artwork Details">
        <div className="flex gap-12">
          <div className="flex flex-col items-center justify-center">
            <div className={containerClassName}>
              <Image.PreviewGroup>
                {artworkDetails.images &&
                  artworkDetails.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image.data}
                      preview={{ mask: <div /> }}
                      style={
                        artworkDetails.images.length === 1
                          ? { width: '500px', maxHeight: '500px', objectFit: 'cover' }
                          : { width: '230px', height: '230px', objectFit: 'cover' }
                      } // Set conditional styles based on the number of images
                      className="rounded-md"
                    />
                  ))}
              </Image.PreviewGroup>
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-end justify-start pb-4 text-5xl font-semibold">
              {artworkDetails.title}
              <span
                className={`ml-4 rounded-md p-1 px-2 text-xl ${getStatusStyles(
                  artworkDetails.status
                )}`}>
                {artworkDetails.status}
              </span>
            </div>

            {artworkDetails.price && (
              <p>
                <span className="text-lg font-semibold">Price:</span> ${artworkDetails.price}
              </p>
            )}
            {currentUser === artworkDetails.createdBy ? (
              <>
                {artworkDetails.commission && (
                  <p>
                    <span className="text-lg font-semibold">Commission:</span> $
                    {artworkDetails.commission.toFixed(2)}
                  </p>
                )}
                {artworkDetails.netEarnings && (
                  <p>
                    <span className="text-lg font-semibold">Net earnings:</span> $
                    {artworkDetails.netEarnings.toFixed(2)}
                  </p>
                )}
              </>
            ) : null}

            {artworkDetails.category && (
              <p>
                <span className="text-lg font-semibold">Category:</span> {artworkDetails.category}
              </p>
            )}
            {artworkDetails.createdBy && (
              <p>
                <span className="text-lg font-semibold">Created By:</span>{' '}
                {artworkDetails.createdBy}
              </p>
            )}
            {artworkDetails.createdAt && (
              <p>
                <span className="text-lg font-semibold">Created At:</span>{' '}
                {artworkDetails.createdAt}
              </p>
            )}
          </div>
        </div>
      </Modal>
      <RejectionDrawer
        visible={rejectDrawerVisible}
        onClose={handleCloseRejectDrawer}
        artworkDetails={artworkDetails}
        onUpdate={onUpdate}
        setArtworkDetails={setArtworkDetails}
      />
    </>
  );
};

ArtworkDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  artworkDetails: PropTypes.object.isRequired,
  setArtworkDetails: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};