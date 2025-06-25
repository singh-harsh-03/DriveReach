import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { toast } from 'react-toastify';

const Notifications = ({ userType: propUserType, notifications: propNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userType, setUserType] = useState(propUserType);

  useEffect(() => {
    if (!propUserType) {
      // Fallback to localStorage only if prop is not provided
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserType(user.type);
    }
  }, [propUserType]);

  useEffect(() => {
    if (propNotifications) {
      // Ensure we only keep the 5 most recent notifications from props
      const recentNotifications = propNotifications.slice(0, 5);
      setNotifications(recentNotifications);
      setUnreadCount(recentNotifications.filter(n => !n.read).length);
    } else {
      fetchNotifications();
    }
    // Set up interval to fetch notifications periodically
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [propNotifications]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Check if date is invalid
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      // Ensure we only keep the 5 most recent notifications
      const recentNotifications = data.slice(0, 5);
      setNotifications(recentNotifications);
      setUnreadCount(recentNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
    setNotifications(notifications.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleBookingResponse = async (e, notificationId, status) => {
    e.stopPropagation(); // Prevent triggering markAsRead
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications/booking-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          notificationId,
          status
        })
      });

      if (response.ok) {
        // Update the notification status locally
        setNotifications(prev => {
          const updatedNotifications = prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, bookingDetails: { ...notif.bookingDetails, status }, read: true }
              : notif
          );
          return updatedNotifications.slice(0, 5); // Ensure we keep only 5 notifications
        });
        toast.success(`Booking request ${status} successfully!`);
        // Refresh notifications to get any new ones
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error responding to booking:", error);
      toast.error("Failed to respond to booking request");
    }
  };

  const isNotificationPending = (notification) => {
    return notification.type === 'booking_request' && 
           (!notification.bookingDetails?.status || 
            notification.bookingDetails?.status === 'pending') &&
           !notification.read; // Only show buttons for unread notifications
  };

  const renderNotificationContent = (notification) => {
    const { type, bookingDetails, message, timestamp, createdAt } = notification;
    const notificationTime = timestamp || createdAt;

    return (
      <div className="space-y-2">
        {/* Show the notification message */}
        <div className="flex justify-between items-start">
          <p className="font-medium text-gray-800">
            {message}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(notificationTime)}
          </p>
        </div>

        {/* Show booking details if they exist */}
        {bookingDetails && (
          <div className="mt-2">
            <p className="text-sm">
              Start Date: {formatDate(bookingDetails.startDate)}
            </p>
            <p className="text-sm">
              Duration: {bookingDetails.numberOfDays} days
            </p>
            {bookingDetails.message && (
              <p className="text-sm italic mt-1">
                "{bookingDetails.message}"
              </p>
            )}

            {/* For drivers: show accept/reject buttons only on new pending booking requests */}
            {userType === 'driver' && (
              <>
                {isNotificationPending(notification) ? (
                  <div className="mt-2 flex gap-2">
                    <button 
                      onClick={(e) => handleBookingResponse(e, notification._id, "accepted")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={(e) => handleBookingResponse(e, notification._id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <p className={`text-sm font-semibold mt-2 ${
                    bookingDetails.status === "accepted" ? "text-green-600" : 
                    bookingDetails.status === "rejected" ? "text-red-600" : 
                    "text-yellow-600"
                  }`}>
                    Status: {(bookingDetails.status || 'pending').charAt(0).toUpperCase() + (bookingDetails.status || 'pending').slice(1)}
                  </p>
                )}
              </>
            )}

            {/* For owners: show status of their requests */}
            {userType === 'owner' && (
              <p className={`text-sm font-semibold mt-2 ${
                bookingDetails.status === "accepted" ? "text-green-600" : 
                bookingDetails.status === "rejected" ? "text-red-600" : 
                "text-yellow-600"
              }`}>
                Status: {(bookingDetails.status || 'pending').charAt(0).toUpperCase() + (bookingDetails.status || 'pending').slice(1)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const sortNotifications = (a, b) => {
    // Sort by read status (unread first)
    if (a.read !== b.read) return a.read ? 1 : -1;
    // Then by date (newest first)
    return new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt);
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
              <span className="text-xs text-gray-500">Showing 5 most recent</span>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center">No notifications</p>
            ) : (
              <div className="space-y-4">
                {notifications.sort(sortNotifications).map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`p-4 rounded-lg cursor-pointer ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                  >
                    {renderNotificationContent(notification)}
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
