// 📁 src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistered: 0,
    totalAvailableSeats: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const res = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
  
        const events = res.data;
        const totalEvents = events.length;
        const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);
        const totalMaxSeats = events.reduce((sum, e) => sum + e.maxSeats, 0);
        const totalAvailableSeats = totalMaxSeats - totalRegistered;
  
        setStats({ totalEvents, totalRegistered, totalAvailableSeats });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, []);

  if (loading) return <p className='dashboard-loading'>Loading statistics...</p>

  return (
    <div className='my-6 px-6 rounded-md'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Event Dashboard</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-blue-100 border-l-4 border-blue-500 p-5 rounded-lg'>
          <h3 className='text-lg font-medium'>Total Events</h3>
          <p className='text-xl font-semibold mt-2'>{stats.totalEvents}</p>
        </div>
        <div className='bg-green-100 border-l-4 border-green-500 p-5 rounded-lg '>
          <h3 className='text-lg font-medium'>Total Registered</h3>
          <p className='text-xl font-semibold mt-2'>{stats.totalRegistered}</p>
        </div>
        <div className='bg-purple-100 border-l-4 border-purple-500 p-5 rounded-lg'>
          <h3 className='text-lg font-medium'>Available Slots</h3>
          <p className='text-xl font-semibold mt-2'>{stats.totalAvailableSeats}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
