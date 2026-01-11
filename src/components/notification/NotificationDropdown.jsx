import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import Notification from './Notification';
import './notificationDropdown.css';

export default function NotificationDropdown({ show, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (show && user) {
      fetchNotifications();
    }
  }, [show, user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/notifications?limit=10');
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="notificationOverlay" onClick={onClose} />
      <div className="notificationDropdown">
        <div className="notificationHeader">
          <h3>Notifications</h3>
          {notifications.some(n => !n.read) && (
            <button className="markAllReadBtn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
        <div className="notificationList">
          {loading ? (
            <div className="notificationLoading">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="notificationEmpty">No notifications yet</div>
          ) : (
            notifications.map(notification => (
              <Notification
                key={notification._id}
                notification={notification}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
