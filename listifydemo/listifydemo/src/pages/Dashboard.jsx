import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Import your CSS file for styling
 
const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({ tasks: [], students: [] });
    const navigate = useNavigate(); // Hook for navigation
 
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/dashboard'); // Ensure this is the correct endpoint
                console.log('Dashboard data:', response.data);
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
 
        fetchDashboardData();
    }, []);
 
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Clear the login state from local storage
        navigate('/login'); // Redirect to the login page
        window.location.reload();
    };
 
    return (
        <div className="dashboard-container">
            {/* Title Container */}
            <div className="title-container">
                <h1>Dashboard Page</h1>
                <p>Overview of your tasks and students</p>
            </div>
 
            <section className="dashboard-section">
                <h2>Tasks Overview</h2>
                {dashboardData.tasks.length > 0 ? (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td>{task.task}</td>
                                        <td
                                            className={`${
                                                task.taskStatus === 'Completed' ? 'status-completed' : ''
                                            } ${
                                                task.taskStatus === 'Ongoing' ? 'status-ongoing' : ''
                                            } ${
                                                task.taskStatus === 'Pending' ? 'status-pending' : ''
                                            }`}
                                            style={{
                                                color:
                                                    task.taskStatus === 'Completed'
                                                        ? '#4CAF50'
                                                        : task.taskStatus === 'Ongoing'
                                                        ? 'red'
                                                        : 'black',
                                            }}
                                        >
                                            {task.taskStatus}
                                        </td>
                                        <td>{new Date(task.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No tasks available</p>
                )}
            </section>
 
            <section className="dashboard-section">
                <h2>Students Overview</h2>
                {dashboardData.students.length > 0 ? (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.email}</td>
                                        <td>{student.firstName}</td>
                                        <td>{student.lastName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No students available</p>
                )}
            </section>
 
            {/* Logout Button */}
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};
 
export default Dashboard;