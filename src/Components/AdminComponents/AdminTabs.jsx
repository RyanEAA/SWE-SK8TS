import React from 'react';
import Cookies from 'js-cookie'; // Import Cookies to get the user role
import '../../css/admin/Admin.css'; // or wherever your Admin.css is
import '../../css/buttons.css';

function AdminTabs({ activeTab, setActiveTab }) {
  const userRole = Cookies.get('user_role'); // Get the user role from cookies

  return (
    <div className="admin-tabs">
      {/* Show "Orders" and "Claimed Orders" for all roles */}
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

      {/* Show the rest of the tabs only for admins */}
      {userRole === 'admin' && (
        <>
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
            className={`btn-tab ${activeTab === 'productManagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('productManagement')}
          >
            Products
          </button>
          <button
            className={`btn-tab ${activeTab === 'allMessages' ? 'active' : ''}`}
            onClick={() => setActiveTab('allMessages')}
          >
            Messages
          </button>
          <button
            className={`btn-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </>
      )}
    </div>
  );
}

export default AdminTabs;