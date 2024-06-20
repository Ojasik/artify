import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import Logout from '../auth/Logout';
import { UserContext } from '../../contexts/UserContext';
import { useCategory } from '../../contexts/CategoryContext';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { AddArtworkModal } from '../artwork/AddArtworkModal';
import { message } from 'antd';
import Cart from '../Cart';

// Array with categories buttons

const categories = [
  { name: 'All', href: '#', current: false },
  { name: 'Painting', href: '#', current: false },
  { name: 'Sculpture', href: '#', current: false },
  { name: 'Literature', href: '#', current: false }
];

// Returns string of filtered classes (conditional rendering)

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar = ({ onArtworkUpdate }) => {
  const [isAddArtworkModalOpen, setIsAddArtworkModalOpen] = useState(false);
  const { currentUser, role } = useContext(UserContext);
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [cartVisible, setCartVisible] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState(null); // State to store stripeAccountId

  const location = useLocation();
  const navigate = useNavigate();

  const fetchStripeAccountId = async () => {
    try {
      const response = await fetch('https://artify-backend-0eef31091a04.herokuapp.com/api/users/get-stripe-account-id', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStripeAccountId(data.stripeAccountId);
        return data.stripeAccountId;
      } else {
        message.error('Failed to fetch Stripe account ID');
        return null;
      }
    } catch (error) {
      console.error('Error fetching Stripe account ID:', error);
      message.error('Error fetching Stripe account ID');
      return null;
    }
  };

  const openAddArtworkModal = () => {
    setIsAddArtworkModalOpen(true);
  };

  const handleCategoryClick = (category) => {
    if (location.pathname === '/') {
      setSelectedCategory(category);
    } else {
      // If not on the homepage, redirect to the homepage with selected category as query parameter
      navigate(`/?category=${category}`);
    }
  };

  const handleSellItemsClick = async () => {
    if (!currentUser) {
      // If user is not logged in, redirect to login page
      navigate('/login');
    } else {
      // Fetch stripeAccountId if it's not already fetched
      const id = stripeAccountId || (await fetchStripeAccountId());
      if (!id) {
        // Show notification if stripeAccountId is missing
        message.warning('You need to link your Stripe account before you can sell items.');
      } else {
        // Open the Add Artwork Modal if stripeAccountId is present
        openAddArtworkModal();
      }
    }
  };

  return (
    <Disclosure>
      {({ open }) => (
        <div className="sticky top-0">
          <AddArtworkModal
            isOpen={isAddArtworkModalOpen}
            onClose={() => setIsAddArtworkModalOpen(false)}
            onArtworkUpdate={onArtworkUpdate}
          />
          <div className="mx-auto bg-white font-semibold shadow-sm sm:shadow-none">
            <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-2 sm:px-6 lg:px-8">
              <div className="flex items-center px-2 sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="rounded-md p-2 text-black hover:bg-mainColor hover:text-white">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
              {/*Logo*/}
              <div>
                <Link to="/">
                  <div className="flex flex-shrink-0 items-center">
                    <img className="h-16 w-auto" src={logo} alt="Artify" />
                    <div className="hidden text-4xl sm:block">artify</div>
                  </div>
                </Link>
              </div>

              {/*Another buttons(cart, registries)*/}
              <div>
                <div className="flex items-center gap-4 pr-2 sm:hidden">
                  <button
                    type="button"
                    className="rounded-full bg-white pr-1 text-black hover:text-mainColor focus:outline-none">
                    <ShoppingCartIcon className="h-8 w-8" onClick={setCartVisible} />
                  </button>
                </div>
                {currentUser ? (
                  <div className="hidden space-x-4 sm:block">
                    {/* If logged in, show profile and logout buttons */}
                    {(role === 'Admin' || role === 'Moderator') && (
                      <>
                        <Link to="/orderregistry">
                          <button className="p-1 text-black hover:text-mainColor">
                            Order Registry
                          </button>
                        </Link>
                        <Link to="/userregistry">
                          <button className="p-1 text-black hover:text-mainColor">
                            User Registry
                          </button>
                        </Link>
                        <Link to="/artworkregistry">
                          <button className="p-1 text-black hover:text-mainColor">
                            Artwork Registry
                          </button>
                        </Link>
                      </>
                    )}
                    <Link to={`/profile/${currentUser}`}>
                      <button className="p-1 pl-8 text-black hover:text-mainColor">Profile</button>
                    </Link>
                    <Logout />
                  </div>
                ) : (
                  <div className="hidden space-x-4 sm:block">
                    {/* If not logged in, show login and signup buttons */}
                    <Link to="/login">
                      <button className="p-1 text-black hover:text-mainColor">Log in</button>
                    </Link>
                    <Link to="/register">
                      <button className="rounded-3xl bg-mainColor px-4 py-2 text-white hover:bg-hoverColor">
                        Sign up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr />

          {/*SECOND HEADER*/}
          <div className="mx-auto bg-gray-50 font-semibold shadow-sm">
            <div className="mx-auto hidden max-w-screen-2xl items-center justify-between py-1 sm:flex sm:px-6 lg:px-8">
              {/*Navigation buttons*/}
              <div className="space-x-4">
                {/*Display data as links(a href)*/}
                {categories.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => handleCategoryClick(item.name)}
                    className={classNames(
                      item.current || selectedCategory === item.name
                        ? 'bg-purple-500 text-white'
                        : 'text-black hover:bg-gray-400 hover:text-white',
                      'rounded-3xl px-3 py-1 font-semibold'
                    )}>
                    {item.name}
                  </a>
                ))}
              </div>
              {/*Another buttons(sell button, like, cart)*/}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleSellItemsClick}
                  className="rounded-full border border-mainColor px-3 font-semibold text-black transition-colors duration-300 hover:bg-mainColor hover:text-white">
                  Sell items
                </button>

                <button
                  type="button"
                  className="rounded-full bg-gray-50 p-1 text-black hover:text-mainColor focus:outline-none">
                  <ShoppingCartIcon className="h-8 w-8" onClick={setCartVisible} />
                </button>
              </div>
            </div>
            <hr className="hidden sm:block" />
          </div>

          {/*Responsive panel(phone)*/}
          <Disclosure.Panel className="relative bg-white px-2 pb-16 shadow-md sm:hidden">
            <div className="py-3 text-2xl font-semibold">Categories</div>
            <hr />
            <div className="space-y-1 py-2">
              {/*Display data as links(a href)*/}
              {categories.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-mainColor text-white'
                      : 'text-black hover:bg-gray-400 hover:text-white',
                    'block rounded-md px-3 py-2 font-semibold'
                  )}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <hr />
            {/*Display sign in and join buttons*/}
            <div className="absolute right-0 flex gap-2 p-2">
              {currentUser ? (
                <div className="space-x-4">
                  {/* If logged in, show profile and logout buttons */}
                  <Link to="/profile">
                    <button className="p-1 text-black hover:text-mainColor">Profile</button>
                  </Link>
                  <Logout />
                </div>
              ) : (
                <div className="space-x-4">
                  {/* If not logged in, show login and signup buttons */}
                  <Link to="/login">
                    <button className="p-1 text-black hover:text-mainColor">Log in</button>
                  </Link>
                  <Link to="/register">
                    <button className="rounded-3xl bg-mainColor px-4 py-2 text-white hover:bg-hoverColor">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
          <Cart
            isOpen={cartVisible}
            onCancel={() => {
              setCartVisible(false);
            }}
          />
        </div>
      )}
    </Disclosure>
  );
};
