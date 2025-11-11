import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const EventCard = ({ event, onDelete }) => {
  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/events/${event._id}`)
      .then(() => {
        toast.success('🗑️ Event deleted');
        onDelete(); // reload list
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Delete failed');
      });
  };

  const handleRegister = () => {
    axios.post(`http://localhost:5000/api/events/${event._id}/register`)
      .then(() => {
        toast.success('Registered successfully');
        onDelete(); // reload to update count
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Registration failed');
      });
  };

  return (
    <div className='border border-gray-800 rounded-md p-4' >
      <h3 className='text-2xl font-medium'>{event.title}</h3>
      <p className='text-xl font-semibold mt-2'><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p  className='text-xl font-semibold mt-2'><strong>Venue:</strong> {event.venue}</p>
      <p  className='text-xl font-semibold mt-2'><strong>Organizer:</strong> {event.organizer}</p>
      <p  className='text-xl font-semibold mt-2'><strong>Seats:</strong> {event.registered}/{event.maxSeats}</p>
      <div className="flex gap-2">
        <button className="bg-black text-white font-light px-8 py-2 mt-4 rounded-sm" onClick={handleRegister} >Register</button>
        <button className="bg-black text-white font-light px-8 py-2 mt-4 rounded-sm" onClick={handleDelete} >Delete</button>
      </div>
    </div>
  );
};

export default EventCard;