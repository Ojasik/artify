import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Disclosure } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Searchbar } from './searchbar';

{
  /*Array with categories buttons (TEST)*/
}

const categories = [
  { name: 'Painting', href: '#', current: true },
  { name: 'Sculpture', href: '#', current: false },
  { name: 'Literature', href: '#', current: false }
];

{
  /*Returns string of filtered classes (conditional rendering)*/
}
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar = () => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <div className="mx-auto font-semibold shadow-sm sm:shadow-none">
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
              <div className="pl-20 sm:pl-0">
                <Link to="/">
                  <div className="flex flex-shrink-0 items-center">
                    <img className="h-16 w-auto" src={logo} alt="Artify" />
                    <div className="hidden text-4xl sm:block">artify</div>
                  </div>
                </Link>
              </div>
              <div className="hidden sm:block">
                <Searchbar /> {/*In process*/}
              </div>
              {/*Another buttons(like, cart, search)*/}
              <div>
                <div className="flex items-center gap-4 pr-2 sm:hidden">
                  <button>
                    <MagnifyingGlassIcon className="h-8 w-8" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-white text-black hover:text-mainColor focus:outline-none">
                    <HeartIcon className="h-8 w-8" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-white pr-1 text-black hover:text-mainColor focus:outline-none">
                    <ShoppingCartIcon className="h-8 w-8" />
                  </button>
                </div>
                <div className="hidden space-x-4 sm:block">
                  <Link to="/login">
                    <button className="p-1 text-black hover:text-mainColor">
                      <div>Log in</div>
                    </button>
                  </Link>
                  <button className="rounded-3xl bg-mainColor px-4 py-2 text-white">
                    <div>Sign up</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />

          {/*SECOND HEADER*/}
          <div className="sticky mx-auto bg-gray-50 font-semibold shadow-sm">
            <div className="mx-auto hidden max-w-screen-2xl items-center justify-between py-1 sm:flex sm:px-6 lg:px-8">
              {/*Navigation buttons*/}
              <div className="space-x-4">
                {/*Display data as links(a href)*/}
                {categories.map((item) => (
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
              {/*Another buttons(sell button, like, cart)*/}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="rounded-3xl border-2 border-mainColor px-3 font-semibold text-black hover:bg-mainColor hover:text-white">
                  Sell items
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-50 p-1 text-black hover:text-mainColor focus:outline-none">
                  <HeartIcon className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gray-50 p-1 text-black hover:text-mainColor focus:outline-none">
                  <ShoppingCartIcon className="h-8 w-8" />
                </button>
              </div>
            </div>
            <hr className="hidden sm:block" />
          </div>

          {/*Responsive panel(phone)*/}
          <Disclosure.Panel className="relative px-2 sm:hidden">
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
              <Link to="/login">
                <button className="p-1 text-black hover:text-mainColor">
                  <div>Sign in</div>
                </button>
              </Link>
              <button className="rounded-3xl bg-mainColor px-4 py-2 text-white">
                <div>Sign up</div>
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
