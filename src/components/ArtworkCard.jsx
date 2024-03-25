import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ArtworkCard = ({ artwork, handleReadMore, openArtworkEditModal, handleDeleteArtwork }) => {
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
      <button className="text-xl font-bold text-mainColor">Buy now</button>
      <button onClick={() => handleReadMore(artwork)} className="text-xl font-bold text-mainColor">
        Read More
      </button>
      <button
        onClick={() => openArtworkEditModal(artwork)}
        className="text-xl font-bold text-mainColor">
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button
        onClick={() => handleDeleteArtwork(artwork._id)}
        className="text-xl font-bold text-red-500">
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
};

ArtworkCard.propTypes = {
  artwork: PropTypes.object.isRequired,
  handleReadMore: PropTypes.func.isRequired,
  openArtworkEditModal: PropTypes.func.isRequired,
  handleDeleteArtwork: PropTypes.func.isRequired
};

export default ArtworkCard;
