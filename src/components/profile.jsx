import React, { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { Editmodal } from './editmodal';

const profilePages = [
  { name: 'On sale', href: '#', current: true },
  { name: 'Sold', href: '#', current: false },
  { name: 'Likes', href: '#', current: false },
  { name: 'Following', href: '#', current: false },
  { name: 'Followers', href: '#', current: false }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Profile = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch user profile data from server when component is rendered
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // User is not authenticated
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          setIsAuthenticated(true);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error during profile data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Empty dependency array ensures the effect runs only once (Works like componentDidMount)

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    // User is not authenticated
    navigate('/login');
    return null;
  }

  return (
    <>
      <Navbar />
      {isEditModalOpen && (
        <Editmodal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      )}
      <div className="mx-auto flex max-w-screen-2xl flex-col justify-between gap-0 sm:flex-row sm:gap-14">
        {/*USER CARD*/}
        <div className="flex w-full flex-col items-center gap-4 pt-12 sm:w-80">
          {/*User Icon*/}
          <div className="mb-2 h-40 w-40 rounded-full bg-mainColor"></div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {userProfile.firstname} {userProfile.lastname}
            </h1>
            <h1 className="text-lg">{userProfile.username}</h1>
          </div>
          <p className="px-6 text-center text-gray-500">{userProfile.description}</p>
          <div className="flex gap-2">
            <GlobeAltIcon className="w-4 text-gray-500" />
            <a className="font-semibold" href="">
              {userProfile.website}
            </a>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button className="w-52 rounded-3xl bg-mainColor py-2 text-white">Follow</button>
            <div className="flex gap-6">
              {userProfile.profile?.facebook && (
                <a href={userProfile.profile.facebook} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon className="text-xl text-gray-500" icon={faFacebookF} />
                </a>
              )}
              {userProfile.profile?.x && (
                <a href={userProfile.profile.x} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon className="text-xl text-gray-500" icon={faXTwitter} />
                </a>
              )}
              {userProfile.profile?.instagram && (
                <a href={userProfile.profile.instagram} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon className="text-xl text-gray-500" icon={faInstagram} />
                </a>
              )}
            </div>
          </div>
          <hr className="w-60" />
          <div className="text-sm">
            Member since {new Date(userProfile.created_at).toDateString()}
          </div>
          <button
            className="rounded-3xl border border-mainColor px-6 py-2 text-mainColor"
            onClick={openEditModal}>
            Edit profile
          </button>
        </div>
        <div className="max-w-screen flex flex-col items-center sm:items-start">
          <div className="mx-auto flex flex-wrap justify-center gap-4 py-12 sm:mx-0">
            {/*Display data as links(a href)*/}
            {profilePages.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-mainColor text-white'
                    : 'text-black hover:bg-gray-400 hover:text-white',
                  'rounded-3xl px-3 py-1 font-semibold'
                )}>
                {item.name}
              </a>
            ))}
          </div>
          {/*CARDS*/}
          <div className="flex w-screen flex-col flex-wrap gap-6 px-4 pb-4 sm:w-full sm:flex-row sm:px-0 sm:pb-0 sm:pr-4 md:pr-0">
            <div className="flex w-full flex-col items-start gap-2 rounded-2xl border p-4 md:w-[47%] lg:w-[31%]">
              <div className="mb-6 flex h-60 w-full items-start justify-end rounded-xl bg-blue-300 p-4">
                <div className="rounded-full bg-white p-2">
                  <HeartIcon className="w-6" />
                </div>
              </div>
              <h2 className="text-2xl">Amazing painting</h2>
              <div className="text-lg font-bold">2200 $</div>
              <button className="text-xl font-bold text-mainColor">Buy now</button>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-2xl border p-4 md:w-[47%] lg:w-[31%]">
              <div className="mb-6 flex h-60 w-full items-start justify-end rounded-xl bg-blue-300 p-4">
                <div className="rounded-full bg-white p-2">
                  <HeartIcon className="w-6" />
                </div>
              </div>
              <h2 className="text-2xl">Amazing painting</h2>
              <div className="text-lg font-bold">2200 $</div>
              <button className="text-xl font-bold text-mainColor">Buy now</button>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-2xl border p-4 md:w-[47%] lg:w-[31%]">
              <div className="mb-6 flex h-60 w-full items-start justify-end rounded-xl bg-blue-300 p-4">
                <div className="rounded-full bg-white p-2">
                  <HeartIcon className="w-6" />
                </div>
              </div>
              <h2 className="text-2xl">Amazing painting</h2>
              <div className="text-lg font-bold">2200 $</div>
              <button className="text-xl font-bold text-mainColor">Buy now</button>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-2xl border p-4 md:w-[47%] lg:w-[31%]">
              <div className="mb-6 flex h-60 w-full items-start justify-end rounded-xl bg-blue-300 p-4">
                <div className="rounded-full bg-white p-2">
                  <HeartIcon className="w-6" />
                </div>
              </div>
              <h2 className="text-2xl">Amazing painting</h2>
              <div className="text-lg font-bold">2200 $</div>
              <button className="text-xl font-bold text-mainColor">Buy now</button>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-2xl border p-4 md:w-[47%] lg:w-[31%]">
              <div className="mb-6 flex h-60 w-full items-start justify-end rounded-xl bg-blue-300 p-4">
                <div className="rounded-full bg-white p-2">
                  <HeartIcon className="w-6" />
                </div>
              </div>
              <h2 className="text-2xl">Amazing painting</h2>
              <div className="text-lg font-bold">2200 $</div>
              <button className="text-xl font-bold text-mainColor">Buy now</button>
            </div>
            <div className="flex w-full flex-col items-start gap-2 rounded-2xl border p-4 md:w-[47%] lg:w-[31%]">
              <div className="mb-6 flex h-60 w-full items-start justify-end rounded-xl bg-blue-300 p-4">
                <div className="rounded-full bg-white p-2">
                  <HeartIcon className="w-6" />
                </div>
              </div>
              <h2 className="text-2xl">Amazing painting</h2>
              <div className="text-lg font-bold">2200 $</div>
              <button className="text-xl font-bold text-mainColor">Buy now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
