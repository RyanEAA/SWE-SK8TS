import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sk8ts-shop.com/api/orders/');
        const orders = response.data;
        
        // Process data for last 14 days
        const today = new Date();
        const dateLabels = [];
        const dailySales = {};
        
        // Initialize last 14 days with 0 sales
        for (let i = 13; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          dateLabels.push(dateString);
          dailySales[dateString] = 0;
        }
        
        // Calculate daily totals
        orders.forEach(order => {
          const orderDate = new Date(order.order_date).toISOString().split('T')[0];
          if (dailySales.hasOwnProperty(orderDate)) {
            dailySales[orderDate] += order.price * order.quantity;
          }
        });
        
        // Prepare chart data
        setChartData({
          labels: dateLabels,
          datasets: [{
            label: 'Daily Sales ($)',
            data: dateLabels.map(date => dailySales[date]),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });
        
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Last 14 Days',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      }
    }
  };

  if (isLoading) return <div>Loading sales data...</div>;

  return (
    <div className="sales-chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;