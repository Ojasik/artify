import React from 'react';
import { Logo } from './logo';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
export const Login = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center gap-4 bg-gray-300 pt-32">
      <Link to="/">
        <Logo className="" />
      </Link>
      <div className="flex w-[360px] flex-col items-center gap-8 rounded-xl bg-white py-8 pb-12 sm:w-[400px]">
        <h1 className="text-4xl">Sign in</h1>
        <form className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <UserIcon className="absolute right-4 top-1/4 h-5" />
              <input
                type="text"
                className="w-80 rounded-full border border-black p-2 px-4"
                placeholder="Username"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="absolute right-4 top-1/4 h-5" />
              <input
                type="password"
                className="w-80 rounded-full border border-black p-2 px-4"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex w-80 justify-between">
            <div className="space-x-2">
              <input type="checkbox" className="accent-mainColor" />
              <label>Remember me</label>
            </div>
            <button className="cursor-pointer">Forgot password?</button>
          </div>
          <input
            className="w-80 cursor-pointer rounded-full bg-mainColor p-2 text-white"
            type="submit"
            value="Login"
          />
          <div>
            Don&apos;t have an account?{' '}
            <button className="cursor-pointer font-bold text-mainColor">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};
