import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { Menu, X } from 'lucide-react';
import axios from 'axios';

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user = null, isAdmin, isAuthenticated } = useSelector((state) => state.auth);
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, { withCredentials: true });
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
      dispatch(logoutUser());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

 const adminLinks = () => (
  <>
    {currentPath !== '/admin/dashboard' && (
      <Link to="/admin/dashboard" className="nav-link bg-white p- text-black rounded-2xl px-5 p-12  text-center">Dashboard</Link>
    )}
  </>
);


const isAuthPage = currentPath === '/login';
  const isHomePage = currentPath === '/';

  const homeLink = !isHomePage && (
  <Link to="/" className="bg-white text-black rounded-xl px-5 p-2  text-center">
    Home
  </Link>
);


  return (
    <>
      <header className="bg-gray-800 h-24 text-white w-full fixed top-0 left-0 z-50 shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-300">Blog Admin</h1>
        <button onClick={toggleSidebar} className="md:hidden text-black">
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center ">
          {homeLink}
          {isAuthenticated && isAdmin && !isAuthPage ? (
            <>
              {adminLinks()}
              <button onClick={handleLogout} className="bg-white text-blue-900 rounded-2xl px-5 p-3  text-center hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <Link to="/login" className="bg-white text-white px-4 py-1 rounded">Login</Link>
            )
          )}
        </nav>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 h-full w-48 bg-gray-900 text-white z-50 flex flex-col p-4 gap-3 md:hidden">
          <button onClick={toggleSidebar} className="self-end text-black bg-white mb-4">
            <X size={24} />
          </button>
          {homeLink}
          {isAuthenticated && isAdmin ? (
            <>
              {adminLinks()}
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="w-full px-4 py-2 rounded text-blue-500 bg-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            !isAuthPage && (
              <Link
                to="/login"
                onClick={toggleSidebar}
                className="w-full bg-white text-blue-600 px-4 py-2 rounded text-center"
              >
                Login
              </Link>
            )
          )}
        </div>
      )}

      {/* Custom Styles */}
      <style>
        {`
          .nav-link {
            border: 1px solid #3b82f6;
            padding: 6px 12px;
            border-radius: 0.75rem;
            transition: all 0.2s ease;
          }
          .nav-link:hover {
            color: #93c5fd;
          }
        `}
      </style>
    </>
  );
};

export default Header;
