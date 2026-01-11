import React from 'react';
import './notification.css';

export default function Notification({ notification, onMarkRead, onDelete }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'reply':
        return '↩️';
      case 'follow':
        return '👤';
      default:
        return '🔔';
    }
  };

  return (
    <div className={`notification ${!notification.read ? 'unread' : ''}`}>
      <img
        className="notificationImg"
        src={notification.sender?.profilePicture || '/assets/person/noAvatar.png'}
        alt=""
      />
      <div className="notificationContent">
        <div className="notificationText">
          <span className="notificationIcon">{getNotificationIcon(notification.type)}</span>
          <span className="notificationUsername">{notification.sender?.username || 'Someone'}</span>
          <span className="notificationMessage"> {notification.message}</span>
        </div>
        <span className="notificationTime">{timeAgo(notification.createdAt)}</span>
      </div>
      <div className="notificationActions">
        {!notification.read && (
          <button
            className="notificationButton markRead"
            onClick={() => onMarkRead(notification._id)}
            title="Mark as read"
          >
            ✓
          </button>
        )}
        <button
          className="notificationButton delete"
          onClick={() => onDelete(notification._id)}
          title="Delete"
        >
          ×
        </button>
      </div>
    </div>
  );
}
