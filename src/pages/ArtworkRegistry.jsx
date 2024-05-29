import React, { useState, useEffect, useContext } from 'react';
import { Navbar } from '../components/common/Navbar';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { UserContext } from '../contexts/UserContext';
import { EditOutlined } from '@ant-design/icons';
import { ArtworkDetailModal } from '../components/artwork/ArtworkDetailModal';

export const ArtworkRegistry = () => {
  const [artworks, setArtworks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const { role } = useContext(UserContext);

  const fetchArtworks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/artworks', {
        credentials: 'include'
      });

      if (response.ok) {
        const artworkList = await response.json();
        setArtworks(artworkList);
      } else {
        console.error('Failed to fetch artworks');
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  if (role !== 'Moderator' && role !== 'Admin') {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-200 text-green-800';
      case 'Rejected':
        return 'bg-gray-300 text-gray-800';
      case 'Uploaded':
        return 'bg-red-200 text-red-800';
      case 'Sold':
        return 'bg-purple-200 text-purple-800';
      default:
        return '';
    }
  };

  const columnDefs = [
    { headerName: 'Title', field: 'title', sortable: true, filter: true, flex: 1 },
    { headerName: 'Price', field: 'price', sortable: true, filter: true, flex: 1 },
    { headerName: 'About', field: 'about', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: ({ value }) => <div className={getStatusClass(value)}>{value}</div>
    },
    { headerName: 'Category', field: 'category', sortable: true, filter: true, flex: 1 },
    { headerName: 'Created By', field: 'createdBy', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Created At',
      field: 'createdAt',
      sortable: true,
      filter: true,
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      flex: 1
    },
    {
      headerName: '',
      field: 'open',
      cellRenderer: (params) => {
        return (
          <div
            className="flex h-full cursor-pointer items-center justify-center text-xl"
            onClick={() => openModal(params.data)}>
            <EditOutlined className="flex w-full justify-center rounded-md px-4 py-1 hover:bg-purple-200 hover:text-mainColor" />
          </div>
        );
      }
    }
  ];

  const openModal = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleCellClicked = (event) => {
    if (event.colDef.field === 'createdBy') {
      // Open user's profile
      window.location.href = `/profile/${event.data.createdBy}`;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <h1 className="my-4 text-center text-2xl font-bold">Artwork Registry</h1>
      <div className="flex-1">
        <div className="ag-theme-quartz p-2" style={{ width: '100%', height: '100%' }}>
          <AgGridReact
            rowData={artworks}
            columnDefs={columnDefs}
            pagination={true}
            onCellClicked={handleCellClicked}
          />
        </div>
      </div>
      {selectedArtwork && (
        <ArtworkDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          artworkDetails={selectedArtwork}
          setArtworkDetails={setSelectedArtwork}
          onUpdate={fetchArtworks}
        />
      )}
    </div>
  );
};
