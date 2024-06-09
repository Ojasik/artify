import React, { useState, useEffect, useContext } from 'react';
import { Navbar } from '../components/common/Navbar';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { EditOutlined } from '@ant-design/icons';
import OrderDetailModal from '../components/order/OrderDetailModal';

export const OrderRegistry = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        credentials: 'include'
      });

      if (response.ok) {
        const orderList = await response.json();
        setOrders(orderList);
        console.log(orderList);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'Processing':
        return 'bg-orange-200 text-orange-800';
      case 'Shipped':
        return 'bg-green-200 text-green-800';
      case 'Delivered':
        return 'bg-purple-200 text-purple-800';
      case 'Cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return '';
    }
  };

  const columnDefs = [
    { headerName: 'Order ID', field: '_id', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Total Price',
      field: 'totalPrice',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => `${params.value.toFixed(2)} €`
    },
    {
      headerName: 'Shipping Cost',
      field: 'shippingCost',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => `${params.value.toFixed(2)} €`
    },
    {
      headerName: 'Country / City',
      field: 'location',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: ({ data }) => `${data.country}, ${data.city}`
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { textAlign: 'center' },
      cellRenderer: ({ value }) => <div className={getStatusClass(value)}>{value}</div>
    },
    {
      headerName: "Buyer's Username",
      field: 'userId.username',
      sortable: true,
      filter: true,
      flex: 1
    },
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

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <h1 className="my-4 text-center text-2xl font-bold">Order Registry</h1>
      <div className="flex-1">
        <div className="ag-theme-quartz p-2" style={{ width: '100%', height: '100%' }}>
          <AgGridReact rowData={orders} columnDefs={columnDefs} pagination={true} />
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailModal
          visible={isModalOpen}
          onClose={closeModal}
          orderDetails={selectedOrder}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
};
