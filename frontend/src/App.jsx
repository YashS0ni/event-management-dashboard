// 📁 src/App.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import EventCard from './components/EventCard'
import EventForm from './components/EventForm'
import AdminLogin from './components/AdminLogin'
import Dashboard from './components/Dashboards'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const [formVisible, setFormVisible] = useState(false)

  // Set token for Axios
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [isAuthenticated])

  // Fetch Events
  const fetchEvents = () => {
    axios
      .get('http://localhost:5000/api/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Error fetching events:', err))
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents()
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Login Page
  if (!isAuthenticated) {
    return (
      <div>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
        <ToastContainer />
      </div>
    )
  }

  //  Authenticated Dashboard View
  return (
    <div className='px-6 py-8 mx-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-semibold text-gray-800 flex items-center gap-2'> Event Task</h1>
        <div className='flex gap-10'>
          <button onClick={handleLogout} className='bg-black text-white font-light px-8 py-2 mt-4 rounded-sm'>
            Logout
          </button>
        </div>
      </div>

      {/*Dashboard Section */}
      <Dashboard />
      {/* event form */}
      <div className='my-2 px-6'>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className='w-full flex justify-center bg-black text-white font-light py-2 mt-4  rounded-sm'
        >
          Add Event
        </button>
      </div>

      {formVisible ? (
        <div className='flex row items-center p-4'>
          <EventForm onEventAdded={fetchEvents} onClose={() => setFormVisible(false)} />
        </div>
      ) : (
        ' '
      )}

      {/* Search Field */}
      <div className='my-6 px-6'>
        <input
          className='w-full p-2 border border-gray-800 rounded-md mb-2 px-2'
          type='text'
          placeholder='Search by event title...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Events Section */}
      <div className='bg-gray-200 rounded-lg mx-6 px-6 '>
        <hr className='my-6 border-gray-300' />
        {filteredEvents.length === 0 ? (
          <p className='text-center text-gray-600  py-6'>No events found</p>
        ) : (
          <div className=' grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-6'>
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} onDelete={fetchEvents} />
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  )
}

export default App
