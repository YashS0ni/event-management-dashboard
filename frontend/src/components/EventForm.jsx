// 📁 frontend/src/components/EventForm.jsx
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const EventForm = ({onEventAdded, onClose}) => {
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    date: '',
    organizer: '',
    maxSeats: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === 'maxSeats' ? parseInt(e.target.value) : e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.date || !formData.venue || !formData.organizer || !formData.maxSeats) {
      toast.error('Please fill all fields')
      return
    }

    axios
      .post('http://localhost:5000/api/events', formData)
      .then(() => {
        toast.success('Event created')
        setFormData({ title: '', venue: '', date: '', organizer: '', maxSeats: '' })
        onEventAdded() // 🔁 Refresh list
        onClose();
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || 'Create failed')
      })

  }

  return (
    <>
      <div
        className='flex items-center justify-center bg-white'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}
      >
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 z-50 '>
          <h2 className='text-2xl font-medium'>Add New Event</h2>
          <input
            className='w-full px-3 py-2 border border-gray-800'
            type='text'
            name='title'
            placeholder='Event Title'
            value={formData.title}
            onChange={handleChange}
          />
          <input
            className='w-full px-3 py-2 border border-gray-800'
            type='text'
            name='venue'
            placeholder='Venue'
            value={formData.venue}
            onChange={handleChange}
          />
          <input className='w-full px-3 py-2 border border-gray-800' type='date' name='date' value={formData.date} onChange={handleChange} />
          <input
            className='w-full px-3 py-2 border border-gray-800'
            type='text'
            name='organizer'
            placeholder='Organizer'
            value={formData.organizer}
            onChange={handleChange}
          />
          <input
            className='w-full px-3 py-2 border border-gray-800'
            type='number'
            name='maxSeats'
            placeholder='Max Seats'
            value={formData.maxSeats}
            onChange={handleChange}
          />
          <div className='flex justify-between w-full gap-2 '>
            <button onClick={onClose} className=' flex-1 bg-black text-white font-light px-8 py-2 mt-4 rounded-sm w-auto'>
            Close
          </button>
          <button className='flex-1 bg-black text-white font-light px-8 py-2 mt-4 rounded-sm' type='submit'>
            📤 Create Event
          </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EventForm
