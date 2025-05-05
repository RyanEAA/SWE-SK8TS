import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecentPersonCard from '../RecentPersonCard';

import '../../css/admin/analytics.css';

const Analytics = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    
    axios.get('https://sk8ts-shop.com/api/admin/top-users')
      .then(res => setTopUsers(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching top users:', err));
    axios.get('https://sk8ts-shop.com/api/admin/top-employees')
      .then(res => setTopEmployees(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching top employees:', err));

    axios.get('https://sk8ts-shop.com/api/admin/top-products')
      .then(res => setTopProducts(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching top products:', err));
  }, []);

  return (
    <div className="dashboard scrollable-list">
      <div className="dashboard-row">
        <div className="card">
          <h2>Top Users</h2>
          {topUsers.map(user => (
            <RecentPersonCard
            key={user.user_id}
            person={user}
            type="user"
            onClick={() => {
              setSelectedUser(user);
              setShowCreateUserPopup(true);
            }}
          />  
          ))}
        </div>

        <div className="card">
          <h2>Top Employees</h2>
          {topEmployees.map(user => (
            <RecentPersonCard
            key={user.user_id}
            person={user}
            type="user"
            onClick={() => {
              setSelectedUser(user);
              setShowCreateUserPopup(true);
            }}
          />
          ))}
        </div>
      </div>

      <div className="dashboard-row">
        <div className="card full-width">
          <h2>Revenue</h2>
          <div className="revenue-chart-placeholder">(Insert chart component here)</div>
        </div>

        <div className="card">
          <h2>Top Products</h2>
          {topProducts.map((product, i) => (
            <div className="product-bar" key={i}>
              <span>{product.name}</span>
              <div className="bar">
                <div
                  className="fill"
                  style={{ width: `${(product.total_ordered / topProducts[0].total_ordered) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
