import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import logo from './assets/logo.png';

// Import pages and components
import Login from './pages/loginpage';
import UserRegister from './pages/Registeruser';
import AdminRegister from './pages/Registeradmin';
import CalendarPage from './pages/Calendar';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notification';
import Home from './pages/Home';
import Profile from './pages/Profile'; // Import Profile component
import Dashboard from './pages/Dashboard'; // Admin Dashboard component

// Import Toastify for notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // For storing user data
    const [page, setPage] = useState('login');
    const [unreadCount, setUnreadCount] = useState(0);
    const [role, setRole] = useState('user'); // Track the user's role

    // Check local storage on mount
    useEffect(() => {
        const loggedInUser = localStorage.getItem('isLoggedIn');
        const storedUserData = localStorage.getItem('userData');
        if (loggedInUser === 'true' && storedUserData) {
            const user = JSON.parse(storedUserData);
            setIsLoggedIn(true);
            setUserData(user);
            setRole(user.role || 'user');
        }
    }, []);

    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/notifications/unread');
            setUnreadCount(response.data.length);
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
        }
    };

    // Polling for unread notifications count
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10); // Poll every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Handle login
    const handleLogin = async (type, credentials) => {
        try {
            const url =
                type === 'users'
                    ? 'http://localhost:8080/api/auth/login/user'
                    : 'http://localhost:8080/api/auth/login/admin';

            const response = await axios.post(url, credentials);
            const userData = response.data;

            setIsLoggedIn(true);
            setUserData(userData);
            setRole(type === 'admins' ? 'admin' : 'user'); // Set role

            // Store user details in local storage
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');

            // Navigate to appropriate page
            if (type === 'admins') {
                setPage('dashboard'); // For admin, go to the dashboard
            } else {
                setPage('home'); // For users, go to the home page
            }
            return true;
        } catch (error) {
            // Show error toast instead of alert
            toast.error('Invalid credentials or user not registered.');

            console.error('Error logging in:', error);
            return false;
        }
    };

    // Handle registration
    const registerUser = async (type, credentials) => {
        try {
            const url =
                type === 'users'
                    ? 'http://localhost:8080/api/auth/register/user'
                    : 'http://localhost:8080/api/auth/register/admin';
            await axios.post(url, credentials);
            toast.success(`${type === 'users' ? 'User' : 'Admin'} registered successfully!`);
            setPage('login');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
            console.error('Error registering:', error);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData'); // Remove user data from localStorage
        setIsLoggedIn(false);
        setUserData(null);
    };

    return (
        <Router>
            <div className="Layout">
                {/* Side Navigation */}
                <div className="SideNavigation">
                    <div className="profile-header">
                        {/* Notifications */}
                        <div className="header-right">
                            <NavLink to="/notifications" className="notification-btn" aria-label="Notifications">
                                🔔
                                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                            </NavLink>
                        </div>

                        {/* Profile Section */}
                        <div className="header-left">
                            <NavLink to={`/profile/${userData?.username}`} className="profile-image-link">
                                <span className="username">{userData ? userData.firstName : 'User'}</span>
                            </NavLink>
                            <img src={logo} alt="User Profile" className="profile-image" />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    {isLoggedIn ? (
                        <>
                            {role !== 'admin' && (
                                <>
                                    <NavLink to="/" className="nav-link">HOME</NavLink>
                                    <NavLink to="/calendar" className="nav-link">CALENDAR</NavLink>
                                    <NavLink to="/tasks" className="nav-link">TASKS</NavLink>
                                </>
                            )}

                            {/* Admin-specific routes */}
                            {role === 'admin' && (
                                <NavLink to="/dashboard" className="nav-link">DASHBOARD</NavLink>
                            )}
                        </>
                    ) : (
                        <>
                            {page === 'login' && (
                                <Login setPage={setPage} handleLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
                            )}
                            {page === 'userRegister' && (
                                <UserRegister setPage={setPage} registerUser={registerUser} />
                            )}
                            {page === 'adminRegister' && (
                                <AdminRegister setPage={setPage} registerUser={registerUser} />
                            )}
                        </>
                    )}
                </div>

                {/* Main Content */}
                <div className="MainContent">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/dashboard" element={<Dashboard />} /> {/* Admin route */}
                    </Routes>
                </div>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer />
        </Router>
    );
};

export default App;
