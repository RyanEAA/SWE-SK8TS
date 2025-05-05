import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Simple UserCard component for displaying users and employees
function UserCard({ person, type }) {
  const metric = type === 'user' ? person.total_orders : person.fulfilled_orders;
  const metricLabel = type === 'user' ? 'Total Orders' : 'Fulfilled Orders';
  return (
    <div className="user-card flex items-center p-4 mb-4 bg-gray-50 rounded-lg shadow">
      <img
        src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?semt=ais_hybrid"
        alt="Profile"
        className="w-16 h-16 object-cover mr-4 rounded-full"
      />
      <div>
        <h4 className="text-lg font-semibold">@{person.username}</h4>
        <p>{metricLabel}: {metric}</p>
      </div>
    </div>
  );
}

// Simple ItemCard component for displaying popular items
function ItemCard({ item }) {
  return (
    <div className="item-card flex items-center p-4 mb-4 bg-gray-50 rounded-lg shadow">
      <img
        src="https://via.placeholder.com/96"
        alt={item.name}
        className="w-24 h-24 object-cover mr-4"
      />
      <div>
        <h4 className="text-lg font-semibold">{item.name}</h4>
        <p>Units Sold: {item.total_sold}</p>
      </div>
    </div>
  );
}

function Analytics() {
  const [selectedRange, setSelectedRange] = useState('all');
  const [activeUsers, setActiveUsers] = useState([]);
  const [productiveEmployees, setProductiveEmployees] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch analytics data on mount
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('https://sk8ts-shop.com/admin/analytics');
        setActiveUsers(response.data.activeUsers);
        setProductiveEmployees(response.data.productiveEmployees);
        // Map popularItems to match ItemCard expectations
        setPopularItems(response.data.popularItems.map(item => ({
          name: item.name,
          total_sold: item.total_sold
        })));
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Note: Time range filtering is not supported by the API, so data remains all-time
  const rangeNote = selectedRange !== 'all' ? (
    <p className="text-yellow-600 mb-4">
      Note: Time range filtering is not supported by the current API. Displaying all-time data.
    </p>
  ) : null;

  return (
    <div className="analytics-page p-6 bg-gray-100 min-h-screen">
      {/* Date Range Selector */}
      <div className="range-selector mb-6">
        <label htmlFor="range-select" className="mr-2 font-medium">Select Date Range:</label>
        <select
          id="range-select"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Time</option>
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {rangeNote}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="analytics-sections grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Users Section */}
          <div className="section bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Top 3 Active Users</h2>
            {activeUsers.length > 0 ? (
              activeUsers.map((user, index) => (
                <UserCard key={index} person={user} type="user" />
              ))
            ) : (
              <p>No active users found.</p>
            )}
          </div>

          {/* Productive Employees Section */}
          <div className="section bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Top 3 Productive Employees</h2>
            {productiveEmployees.length > 0 ? (
              productiveEmployees.map((employee, index) => (
                <UserCard key={index} person={employee} type="employee" />
              ))
            ) : (
              <p>No productive employees found.</p>
            )}
          </div>

          {/* Popular Items Section */}
          <div className="section bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Top 5 Popular Items</h2>
            {popularItems.length > 0 ? (
              popularItems.map((item, index) => (
                <ItemCard key={index} item={item} />
              ))
            ) : (
              <p>No popular items found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;