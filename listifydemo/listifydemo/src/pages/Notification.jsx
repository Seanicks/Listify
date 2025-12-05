import React, { useEffect, useState } from 'react';
import './notification.css';

const Notification = ({ fetchUnreadCount, markNotificationAsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications');
      const data = await response.json();

      // Compare with the current state to find new notifications
      const newNotif = data.find(
        (notif) => !notifications.some((existing) => existing.id === notif.id)
      );

      if (newNotif) {
        setNewNotification(newNotif); // Show pop-up for the new notification
        setTimeout(() => setNewNotification(null), 5000); // Hide pop-up after 5 seconds
      }

      setNotifications(data);
      fetchUnreadCount(); // Update unread count in parent
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id); // Call the parent method or API
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      alert('Notification deleted successfully!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification. Please try again.');
    }
  };
  

  const generateNotifications = async () => {
    try {
      await fetch('http://localhost:8080/api/notifications/generate', { method: 'POST' });
      alert('Notifications generated successfully!');
      fetchNotifications(); // Refresh all notifications
    } catch (error) {
      console.error('Error generating notifications:', error);
      alert('Failed to generate notifications. Please try again.');
    }
  };

  return (
    <>
      {/* Pop-up for New Notification */}
      {newNotification && (
        <div className="popup">
          <p>New Notification!</p>
          <p className="popup-task">{`Task: ${newNotification.task.task}`}</p>
          <p className="popup-date">{`Due Date: ${newNotification.task.date}`}</p>
        </div>
      )}

      <div className="notification-container">
        <div className="NotificationBox">
          <h2>Notifications</h2>
        </div>
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? 'read' : ''}`}
                >
                  <p className="notification-title">REMINDER!!!</p>
                  <p className="notification-task">{`Task: ${notification.task.task}`}</p>
                  <p className="notification-date">{`Due Date: ${notification.task.date}`}</p>
                  {/* Delete button remains enabled regardless of read state */}
                  <button
                    className="delete-btn"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    Delete
                  </button>
                 
                </li>
              ))}

          </ul>
        ) : (
          <p className="no-notifications">No notifications available</p>
        )}
      </div>
      <button className="generate-btn" onClick={generateNotifications}>
        Generate Notifications
      </button>
    </>
  );
};

export default Notification;
