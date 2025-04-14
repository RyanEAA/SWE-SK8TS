import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../css/admin/Admin.css';

// admin components
import AdminTabs from '../Components/AdminComponents/AdminTabs';
import Overall from '../Components/AdminComponents/Overall';
import AllEmployees from '../Components/AdminComponents/AllEmployees';
import AllUsers from '../Components/AdminComponents/AllUsers';
import AllOrders from '../Components/AdminComponents/AllOrders';
import ClaimedOrders from '../Components/AdminComponents/ClaimedOrders';
import ProductManagement from './ProductManagement';

function Admin() {
  const [activeTab, setActiveTab] = useState('overall');
  const [claimedOrders, setClaimedOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState({
    claimedOrders: true,
    users: true,
    employees: true,
    orders: true,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  // fetchData (same as you had)

  return (
    <div className="admin-tabs">
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'overall' && (
        <Overall/>
      )}

      {activeTab === 'employees' && (
        <AllEmployees
        />
      )}

      {activeTab === 'users' && (
        <AllUsers
        />
      )}

      {activeTab === 'orders' && (
        <AllOrders
          setSelectedOrder={setSelectedOrder}
        />
      )}

      {activeTab === 'claimedOrders' && (
        <ClaimedOrders/>
      )}

      {activeTab === 'productManagement' && (
        <ProductManagement/>
      )}
        
    </div>
  );
}

export default Admin;
