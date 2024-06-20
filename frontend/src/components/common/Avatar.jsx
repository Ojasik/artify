import React from 'react';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';

const Avatar = ({ imageUrl, onDelete }) => {
  return (
    <span className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-mainColor">
      {imageUrl ? (
        <img src={imageUrl} alt="Profile Icon" className="h-full w-full object-cover" />
      ) : (
        <UserOutlined className="text-4xl text-gray-300" />
      )}
      {imageUrl && onDelete && (
        <button
          type="button"
          className="absolute right-0 top-0 m-1 rounded-full bg-white p-1 text-red-500"
          onClick={onDelete}>
          <CloseOutlined />
        </button>
      )}
    </span>
  );
};

export default Avatar;
