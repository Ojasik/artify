import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';

export const ArtworkDetailsModal = ({ isOpen, onClose, artworkDetails }) => {
  const imagesContainerClass =
    artworkDetails.images && artworkDetails.images.length > 1
      ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
      : '';

  return (
    <Dialog open={isOpen} onClose={onClose} as="div" className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:mt-0 sm:text-center">
                <Dialog.Title as="h3" className="pb-3 text-2xl font-semibold text-gray-900">
                  Artwork Details
                </Dialog.Title>

                {/* Display all images in the artwork */}
                <div className={imagesContainerClass}>
                  {artworkDetails.images &&
                    artworkDetails.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.data}
                        alt={`Artwork ${index + 1}`}
                        className="mb-4 rounded border border-black p-2 px-4"
                        style={{ maxWidth: '100%', width: '100%' }}
                      />
                    ))}
                </div>

                {/* Display about information */}
                <p className="mt-4">{artworkDetails.about}</p>
              </div>
            </div>
            <div className="px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

ArtworkDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  artworkDetails: PropTypes.object.isRequired
};
