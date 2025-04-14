// AdminTabs.jsx
import React from 'react';
import '../../css/admin/Admin.css'; // or wherever your Admin.css is
import '../../css/buttons.css';

function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="admin-tabs">
      <button
        className={`btn-tab ${activeTab === 'overall' ? 'active' : ''}`}
        onClick={() => setActiveTab('overall')}
      >
        Overall
      </button>
      <button
        className={`btn-tab ${activeTab === 'employees' ? 'active' : ''}`}
        onClick={() => setActiveTab('employees')}
      >
        Employees
      </button>
      <button
        className={`btn-tab ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        Users
      </button>
      <button
        className={`btn-tab ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => setActiveTab('orders')}
      >
        Orders
      </button>
      <button
        className={`btn-tab ${activeTab === 'claimedOrders' ? 'active' : ''}`}
        onClick={() => setActiveTab('claimedOrders')}
      >
        Claimed Orders
      </button>

      <button
        className={`btn-tab ${activeTab === 'productManagement' ? 'active' : ''}`}
        onClick={() => setActiveTab('productManagement')}
      >
        Product Management
      </button>

    </div>
  );
}

export default AdminTabs;
