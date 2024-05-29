import React, { useState, useEffect, useContext } from 'react';
import { Navbar } from '../components/common/Navbar';
import { UserContext } from '../contexts/UserContext';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  InstagramOutlined,
  FacebookOutlined,
  XOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { UserEditModal } from '../components/auth/UserEditModal';
import { Switch, Popconfirm, message } from 'antd';

export const UserRegistry = () => {
  const [users, setUsers] = useState([]);
  const { role } = useContext(UserContext);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setIsOpen(true);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        credentials: 'include'
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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (role !== 'Moderator' && role !== 'Admin') {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  // Define column definitions for ag-Grid
  const columnDefs = [
    { headerName: 'Username', field: 'username', sortable: true, filter: true, flex: 1 },
    { headerName: 'First Name', field: 'firstname', sortable: true, filter: true, flex: 1 },
    { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true, flex: 1 },
    { headerName: 'Email', field: 'email', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Description',
      field: 'profile.description',
      sortable: true,
      filter: true,
      flex: 1,
      hide: !showAdditionalInfo
    },
    {
      headerName: 'Website',
      field: 'profile.website',
      sortable: true,
      filter: true,
      flex: 1,
      hide: !showAdditionalInfo
    },
    { headerName: 'Role', field: 'role', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Created At',
      field: 'created_at',
      sortable: true,
      filter: true,
      hide: !showAdditionalInfo,
      valueFormatter: ({ value }) => new Date(value).toLocaleString()
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: ({ value }) => (
        <div
          className={
            value === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
          }>
          {value}
        </div>
      )
    },

    {
      headerName: 'Social Media',
      field: 'profile',
      hide: !showAdditionalInfo,
      cellRenderer: ({ data }) => {
        const profile = data.profile || {};

        return (
          <div className="flex h-full items-center justify-center gap-8 text-xl">
            {profile.instagram && (
              <InstagramOutlined
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
              />
            )}
            {profile.facebook && (
              <FacebookOutlined href={profile.facebook} target="_blank" rel="noopener noreferrer" />
            )}
            {profile.x && <XOutlined href={profile.x} target="_blank" rel="noopener noreferrer" />}
          </div>
        );
      }
    },
    {
      cellRenderer: (params) => (
        <div className="flex h-full items-center justify-center gap-4 text-xl">
          <EditOutlined
            onClick={() => handleEdit(params.data)}
            className="rounded-md p-2 hover:bg-purple-200 hover:text-mainColor"
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(params.data.username)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              className: 'rounded-full bg-mainColor hover:bg-hoverColor'
            }}
            cancelButtonProps={{
              className: 'rounded-full '
            }}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: 'red'
                }}
              />
            }>
            <DeleteOutlined className="rounded-md p-2 hover:bg-red-200 hover:text-red-800" />
          </Popconfirm>
          {params.data.status === 'Active' ? (
            <Popconfirm
              title="Are you sure you want to disable this user?"
              onConfirm={() => handleDisableUser(params.data.username)}
              okText="Yes"
              cancelText="No"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: 'red'
                  }}
                />
              }>
              <StopOutlined className="rounded-md p-2 hover:bg-red-200 hover:text-red-800" />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to enable this user?"
              onConfirm={() => handleEnableUser(params.data.username)}
              okText="Yes"
              cancelText="No"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: 'red'
                  }}
                />
              }>
              <CheckCircleOutlined className="rounded-md p-2 hover:bg-green-200 hover:text-green-800" />
            </Popconfirm>
          )}
        </div>
      )
    }
  ];

  const handleCellClicked = (event) => {
    if (event.colDef.field === 'username') {
      // Open user's profile
      window.location.href = `/profile/${event.data.username}`;
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedRow(null);
  };

  const handleDeleteUser = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${username}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('User deleted successfully');
        fetchUsers();
      } else {
        console.error('Failed to delete user');
        console.log(username);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDisableUser = async (username) => {
    await handleUserStatusChange(username, 'disable');
  };

  const handleEnableUser = async (username) => {
    await handleUserStatusChange(username, 'enable');
  };

  const handleUserStatusChange = async (username, status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${username}/${status}`, {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        console.log(`User ${status === 'disable' ? 'disabled' : 'enabled'} successfully`);
        fetchUsers();
      } else {
        console.error(`Failed to ${status === 'disable' ? 'disable' : 'enable'} user`);
        console.log(username);
      }
    } catch (error) {
      console.error(`Error ${status === 'disable' ? 'disabling' : 'enabling'} user:`, error);
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <Navbar />
        {selectedRow && (
          <UserEditModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            rowData={selectedRow}
            onUpdateSuccess={fetchUsers}
          />
        )}
        <h1 className="my-4 text-center text-2xl font-bold">User Registry</h1>
        <Switch
          checked={showAdditionalInfo}
          onChange={() => setShowAdditionalInfo(!showAdditionalInfo)}
          className="ml-2 w-24"
          checkedChildren="Hide Info"
          unCheckedChildren="Show Info"
          style={{ backgroundColor: showAdditionalInfo ? '#7734e7' : 'lightgray' }}
        />
        <div className="flex-1">
          <div className="ag-theme-quartz  p-2" style={{ width: '100%', height: '100%' }}>
            <AgGridReact
              rowData={users}
              columnDefs={columnDefs}
              pagination={true}
              onCellClicked={handleCellClicked}
            />
          </div>
        </div>
      </div>
    </>
  );
};
