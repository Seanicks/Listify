import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css'; // Import the CSS file
 
// Custom hook for debouncing values
const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
 
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
 
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
 
  return debouncedValue;
};
 
// Memoized ProfileDetail component to avoid unnecessary re-renders
const ProfileDetail = React.memo(({ label, value }) => (
  <div>
    <strong>{label}:</strong> {value}
  </div>
));
 
const Profile = () => {
  const [studentData, setStudentData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '' // Add profile picture field
  });
  const [error, setError] = useState('');
 
  // Debounced values for name fields to reduce re-renders
  const debouncedFirstName = useDebouncedValue(formData.firstName, 500);
  const debouncedLastName = useDebouncedValue(formData.lastName, 500);
 
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      fetchStudentData(user.id);  // Use the ID of the logged-in student
    }
  }, []);
 
  const fetchStudentData = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/student/getStudentById`, {
        params: { id: studentId }
      });
 
      const student = response.data; // Assuming the response data contains the student object
      setStudentData(student);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        profilePicture: student.profilePicture || '', // Add the profile picture URL
      });
    } catch (error) {
      setError('Error fetching student data');
      console.error('Error fetching student data:', error);
    }
  };
 
  const handleEdit = () => {
    setEditMode(true);
  };
 
  const handleBack = () => {
    setEditMode(false); // Go back to the view mode
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: reader.result // Set the profile picture as base64
        }));
      };
      reader.readAsDataURL(file); // Read the file as base64
    }
  };
 
  const handleSave = async (e) => {
    e.preventDefault();
 
    // Optimistically update the UI
    setStudentData((prevData) => ({
      ...prevData,
      firstName: formData.firstName,
      lastName: formData.lastName
    }));
 
    try {
      const studentId = studentData.id;
      await axios.put(`http://localhost:8080/api/student/putStudentDetails`, formData, {
        params: { id: studentId }
      });
      setEditMode(false);
      alert('Profile updated successfully');
      localStorage.setItem('userData', JSON.stringify({ ...studentData, ...formData }));
    } catch (error) {
      setError('Error saving student data');
      console.error('Error saving student data:', error);
      // Optionally revert the changes if the API call fails
      setStudentData((prevData) => ({
        ...prevData,
        firstName: prevData.firstName,
        lastName: prevData.lastName
      }));
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setStudentData(null);
    setEditMode(false);
    window.location.reload();
  };
 
  if (!studentData) {
    return <div>Loading...</div>;
  }
 
  return (
    <div className="profile-container">
      <div className="welcome-container">
        <div className="welcome-box">
          <h1>Welcome</h1>
        </div>
        <h1 className="welcome-message">{studentData.firstName}!</h1>
      </div>
      
      <div className="profileHeader">
        <hr />
        <div className="profile-box">
          <h2>Profile</h2>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-details">
        {editMode ? (
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          
            
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" onClick={handleBack} className="back-button">Back</button>
          </form>
        ) : (
          <>
            <ProfileDetail label="First Name" value={debouncedFirstName || studentData.firstName} />
            <ProfileDetail label="Last Name" value={debouncedLastName || studentData.lastName} />
            
          </>
        )}
         <hr />
      </div>

      <button onClick={handleEdit} className="edit-button">Edit Profile</button>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>

  );
};
 
export default Profile;