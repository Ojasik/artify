import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';

{
  /*Array with navigation buttons*/
}
const navigation = [
  { name: 'Gallery', href: '#', current: true },
  { name: 'Sell', href: '#', current: false }
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
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 font-semibold">
            <div className="relative flex items-center justify-between py-4">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-mainColor hover:text-white">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/*Logo*/}
                <Link to="/">
                  <div className="flex flex-shrink-0 items-center">
                    <img className="h-16 w-auto" src={logo} alt="Artify" />
                    <div className="text-4xl hidden sm:block">artify</div>
                  </div>
                </Link>
                {/*Navigation buttons*/}
                <div className="hidden sm:ml-10 sm:flex">
                  <div className="flex gap-4 items-center">
                    {/*Display data as links(a href)*/}
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-mainColor text-white'
                            : 'text-black hover:bg-gray-400 hover:text-white',
                          'rounded-3xl px-3 py-2 font-semibold'
                        )}>
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {/*Another buttons(like, cart, sign in, join)*/}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-4">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-black hover:text-mainColor focus:outline-none">
                  <HeartIcon className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-black hover:text-mainColor focus:outline-none">
                  <ShoppingCartIcon className="h-8 w-8" />
                </button>
                <div className="hidden md:flex gap-4">
                  <button className="relative p-1 text-black hover:text-mainColor">
                    <div>Sign in</div>
                  </button>
                  <button className="relative py-2 px-4 text-white bg-mainColor rounded-3xl">
                    <div>Get Started</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*Responsive panel(phone)*/}
          <Disclosure.Panel className="sm:hidden relative">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/*Display data as links(a href)*/}
              {navigation.map((item) => (
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
            <div className="absolute right-0 p-2 flex gap-2">
              <button className="p-1 text-black hover:text-mainColor">
                <div>Sign in</div>
              </button>
              <button className="py-2 px-4 text-white bg-mainColor rounded-3xl">
                <div>Get Started</div>
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
