import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Input } from 'antd';

const RejectionDrawer = ({ visible, onClose, artworkDetails, onUpdate, setArtworkDetails }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleRejection = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/artworks/${artworkDetails._id}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ rejectionReason })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject artwork');
      }

      // Reset rejection reason
      setRejectionReason('');
      setArtworkDetails({ ...artworkDetails, status: 'Rejected' });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error rejecting artwork:', error);
    }
  };

  return (
    <Drawer
      title="Reject Artwork"
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}>
      <Input.TextArea
        rows={4}
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        placeholder="Enter rejection reason"
        className="mb-4"
      />
      <button
        onClick={handleRejection}
        className="float-right inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-end text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:w-auto">
        Submit
      </button>
    </Drawer>
  );
};

RejectionDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  artworkDetails: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  setArtworkDetails: PropTypes.func.isRequired
};

export default RejectionDrawer;
