import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="shadow-sm bg-white border-b border-gray-100">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3 text-slate-800">

        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-9 w-auto" />
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center text-xs">
              {initials}
            </div>
            <span className="max-sm:hidden text-slate-600">Hi, <span className="font-medium text-slate-800">{user?.name}</span></span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 border border-gray-300 px-5 py-1.5 rounded-full active:scale-95 transition-all text-sm"
          >
            Logout
          </button>
        </div>

      </nav>
    </div>
  )
}

export default Navbar