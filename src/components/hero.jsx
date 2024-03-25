import React, { useState, useEffect } from 'react';
import { Navbar } from './navbar';

export const Hero = () => {
  const [artworks, setArtworks] = useState([]);
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/artworks');
        if (response.ok) {
          const artworksData = await response.json();
          setArtworks(artworksData);
        } else {
          console.error('Failed to fetch artworks');
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <>
      <Navbar />
      <div className="m-auto grid max-w-screen-2xl grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {artworks.map((artwork) => (
          <div key={artwork._id} className="flex flex-col items-start gap-2 rounded-2xl border p-4">
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
            <button className="text-xl font-bold text-mainColor">Read More</button>
          </div>
        ))}
      </div>
    </>
  );
};
