// AllEmployees.jsx
import React, { useEffect, useState } from 'react';
import RecentPersonCard from '../RecentPersonCard';
import '../../css/admin/Admin.css';

function AllEmployees() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchAllEmployees = async () => {

      try {
        setIsLoading(true);
        const response = await fetch('https://sk8ts-shop.com/api/employees/');
        //const response = await fetch('http://localhost:3636/employees');
        const data = await response.json();
        setAllEmployees(data);
      } catch (error){
        console.log('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      } 
    };

    fetchAllEmployees();
  }, []);

  return (
    <div className="admin-section">
      <h1>All Employees</h1>
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : ( // no loading
        <div className="recent-list">
          {allEmployees.length > 0 ? ( // more than 0 employee
            allEmployees.map(employee => (
              <RecentPersonCard key={employee.user_id} person={employee} type="employee" />
            ))
          ) : (
            <p>No employees found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AllEmployees;
