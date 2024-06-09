import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { UserContext } from '../../contexts/UserContext';

import PropTypes from 'prop-types';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Uploaded':
      return 'bg-yellow-200 text-yellow-800';
    case 'Verified':
      return 'bg-green-200 text-green-800';
    case 'Sold':
      return 'bg-purple-200 text-mainColor';
    case 'In Order':
      return 'bg-blue-200 text-blue-800';
    case 'Rejected':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export const ArtworkCard = ({
  artwork,
  handleReadMore,
  openArtworkEditModal,
  handleDeleteArtwork,
  addToCart
}) => {
  const { currentUser } = useContext(UserContext);
  const handleAddToCart = () => {
    addToCart(artwork._id); // Call the addToCart function with artwork ID as parameter
  };

  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/order/${artwork._id}`, { state: { artworks: [artwork] } });
  };

  const isEditable =
    currentUser === artwork.createdBy &&
    ['Uploaded', 'Verified', 'Rejected'].includes(artwork.status);

  const isDeletable =
    currentUser === artwork.createdBy &&
    ['Uploaded', 'Verified', 'Rejected'].includes(artwork.status);

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div>
        {artwork.images.length > 0 && (
          <img
            src={artwork.images[0].data}
            alt={`Artwork`}
            className="h-60 w-full rounded-t-xl object-cover"
          />
        )}
        <div className="flex flex-col gap-2 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{artwork.title}</h2>
            {currentUser !== artwork.createdBy && (
              <button
                onClick={handleAddToCart}
                className="rounded-full border border-mainColor px-2 py-1 text-xl font-semibold text-mainColor transition-colors duration-300 hover:bg-mainColor hover:text-white">
                <ShoppingCartOutlined />
              </button>
            )}
          </div>
          <div className="text-lg font-bold text-gray-700">${artwork.price}</div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleReadMore(artwork)}
              className="text-lg font-semibold text-mainColor">
              View Details
            </button>
            <div className="flex gap-2">
              {isEditable && (
                <EditOutlined
                  onClick={() => openArtworkEditModal(artwork)}
                  className="cursor-pointer rounded-md p-2 hover:bg-purple-200 hover:text-mainColor"
                />
              )}
              {isDeletable && (
                <Popconfirm
                  title="Are you sure to delete this artwork?"
                  onConfirm={() => handleDeleteArtwork(artwork._id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{
                    className: 'rounded-full bg-mainColor hover:bg-hoverColor'
                  }}
                  cancelButtonProps={{
                    className: 'rounded-full '
                  }}
                  icon={
                    <QuestionCircleOutlined
                      style={{
                        color: 'red'
                      }}
                    />
                  }>
                  <DeleteOutlined className="cursor-pointer rounded-md p-2 hover:bg-red-200 hover:text-red-800" />
                </Popconfirm>
              )}
            </div>
          </div>
          {currentUser !== artwork.createdBy && (
            <button
              onClick={handleBuyNow}
              className="rounded-full border border-mainColor px-4 py-2 text-lg font-semibold text-mainColor transition-colors duration-300 hover:bg-mainColor hover:text-white">
              Buy Now
            </button>
          )}
        </div>
      </div>
      {currentUser === artwork.createdBy && (
        <div
          className={`rounded-b-xl px-4 py-2 text-center font-semibold ${getStatusStyles(
            artwork.status
          )}`}>
          {artwork.status}
        </div>
      )}
    </div>
  );
};

ArtworkCard.propTypes = {
  artwork: PropTypes.object.isRequired,
  handleReadMore: PropTypes.func.isRequired,
  openArtworkEditModal: PropTypes.func,
  handleDeleteArtwork: PropTypes.func,
  showBuyButton: PropTypes.bool,
  showEditButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  addToCart: PropTypes.func
};
