import React, { useContext } from 'react';
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
      return 'bg-red-200 text-red-800';
    case 'Verified':
      return 'bg-green-200 text-green-800';
    case 'Sold':
      return 'bg-purple-200 text-mainColor';
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

  return (
    <div className="rounded-xl border shadow-lg transition-shadow duration-300 hover:shadow-xl">
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
        </div>
        <div className="text-lg font-bold text-gray-700">${artwork.price}</div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleReadMore(artwork)}
            className="text-xl font-semibold text-mainColor hover:underline">
            Read More
          </button>
          <div className="flex gap-2">
            {currentUser === artwork.createdBy && (
              <EditOutlined
                onClick={() => openArtworkEditModal(artwork)}
                className="cursor-pointer rounded-md p-2 hover:bg-purple-200 hover:text-mainColor"
              />
            )}
            {currentUser === artwork.createdBy && (
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
          {currentUser !== artwork.createdBy && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1 text-xl font-semibold text-mainColor hover:underline">
              <ShoppingCartOutlined />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
        {currentUser !== artwork.createdBy && (
          <button className="mt-2 w-full rounded-full bg-mainColor py-2 text-xl font-bold text-white transition-colors duration-300 hover:bg-hoverColor">
            Buy Now
          </button>
        )}
        {currentUser === artwork.createdBy && (
          <span
            className={`rounded-md p-1 px-2 text-center text-xl ${getStatusStyles(
              artwork.status
            )}`}>
            {artwork.status}
          </span>
        )}
      </div>
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
