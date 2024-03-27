import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ArtworkCard = ({
  artwork,
  handleReadMore,
  openArtworkEditModal,
  handleDeleteArtwork,
  showBuyButton,
  showDeleteButton,
  showEditButton,
  addToCart
}) => {
  const handleAddToCart = () => {
    addToCart(artwork._id); // Call the addToCart function with artwork ID as parameter
  };
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border p-4">
      {artwork.images.length > 0 && (
        <img
          src={artwork.images[0].data}
          alt={`Artwork 1`}
          className="h-60 w-full rounded object-cover"
        />
      )}
      <h2 className="text-2xl">{artwork.title}</h2>
      <div className="text-lg font-bold">${artwork.price}</div>
      {showBuyButton && (
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 text-xl font-bold text-mainColor">
          <FontAwesomeIcon icon={faCartPlus} />
        </button>
      )}
      {showBuyButton && <button className="text-xl font-bold text-mainColor">Buy now</button>}
      <button onClick={() => handleReadMore(artwork)} className="text-xl font-bold text-mainColor">
        Read More
      </button>
      {showEditButton && (
        <button
          onClick={() => openArtworkEditModal(artwork)}
          className="text-xl font-bold text-mainColor">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
      {showDeleteButton && (
        <button
          onClick={() => handleDeleteArtwork(artwork._id)}
          className="text-xl font-bold text-red-500">
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
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

export default ArtworkCard;
