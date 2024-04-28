import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from './navbar';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(decodedToken.role);
      console.log('User Role:', decodedToken.role);
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const userList = await response.json();
          setUsers(userList);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchArtworks = async () => {
      try {
        const artworkResponse = await fetch('http://localhost:8000/api/artworks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (artworkResponse.ok) {
          const artworkList = await artworkResponse.json();
          setArtworks(artworkList);
        } else {
          console.error('Failed to fetch artworks');
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchUsers();
    fetchArtworks();
  }, []);

  if (userRole !== 'moderator' && userRole !== 'admin') {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {/* <div>
        <h1>Admin Page</h1>
        <div>
          <h2>User List</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <Link to={`/profile/${user.username}`}>
                  <button>{user.username}</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      <div>
        <h1>Admin Page</h1>
        <div>
          <h2>User List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Username
                  </th>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    First Name
                  </th>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Name
                  </th>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created At
                  </th>
                  <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Social Media Links
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link to={`/profile/${user.username}`}>
                        <button className="text-blue-500">{user.username}</button>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{user.firstname}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.lastname}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {user.profile.instagram && (
                        <a href={user.profile.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      )}
                      {user.profile.facebook && (
                        <a href={user.profile.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      )}
                      {user.profile.x && (
                        <a href={user.profile.x} target="_blank" rel="noopener noreferrer">
                          X
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h2>Artwork List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  About
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created By
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Open
                </th>
                <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {artworks.map((artwork) => (
                <tr key={artwork._id}>
                  <td className="whitespace-nowrap px-6 py-4">{artwork.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">${artwork.price}</td>
                  <td className="whitespace-nowrap px-6 py-4">{artwork.about}</td>
                  <td className="whitespace-nowrap px-6 py-4">{artwork.status}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {artwork.createdBy && (
                      <Link to={`/profile/${artwork.createdBy}`}>
                        <button className="text-blue-500">{artwork.createdBy}</button>
                      </Link>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="text-blue-500">Open</button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="text-blue-500">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
