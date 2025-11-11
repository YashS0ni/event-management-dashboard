import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const AdminLogin = ({ onLogin }) => {
  const [currentState ,setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({ email: '', password: '',name:''});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = '';
      if (currentState === 'Login') {
        url = 'http://localhost:5000/api/user/login';
      } else if (currentState === 'SignUp') {
        url = 'http://localhost:5000/api/user/register';
      } else if (currentState === 'admin') {
        url = 'http://localhost:5000/api/admin/login';
      }
      const res = await axios.post(url, formData);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        toast.success('Login successful!');
        onLogin(); // trigger parent state change
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <h2 className='text-2xl font-medium'>{currentState}</h2>
        {currentState === 'Login' ? '' : <input className='w-full px-3 py-2 border border-gray-800' type='text' name='name' placeholder='Name' required onChange={handleChange} />}
        <input className='w-full px-3 py-2 border border-gray-800' type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input className='w-full px-3 py-2 border border-gray-800' type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          {
            currentState === 'Login' 
            ? <p onClick={()=>setCurrentState('SignUp')} className='cursor-pointer'>Create Account</p>
            : <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
          }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4 rounded-sm'>{currentState === 'Login' ? 'Log In' : 'Sign Up' }</button>
      </form>
    </div>
  );
};

export default AdminLogin;
