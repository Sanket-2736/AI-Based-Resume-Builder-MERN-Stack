import { LockIcon, Mail, User2Icon } from 'lucide-react'
import React, { useEffect } from 'react'
import api from '../congifs/api';
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const urlstate = query.get('state')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (!loading && token) {
      navigate('/app');
    }
  }, [token, loading]);



  const [state, setState] = React.useState(urlstate || "login")
    
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      dispatch(login(data));
      localStorage.setItem('token', data.token);
      toast.success(data.message);
      navigate('/app')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex shadow items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md flex flex-col items-center px-6">

        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state} to continue
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
            <User2Icon size={16} color="#687280" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border-none outline-none"
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
          <Mail size={13} color="#687280" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email id"
            className="w-full border-none outline-none"
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
          <LockIcon size={16} color="#687280" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border-none outline-none"
            required
          />
        </div>

        <div className="mt-4 w-full text-right text-green-500">
          <button type="button" className="text-sm">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState(prev => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-green-500 ml-1">click here</span>
        </p>

      </div>
    </form>
  )
}

export default Login;
