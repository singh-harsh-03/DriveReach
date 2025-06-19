import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch from your backend
    const mockNotifications = [
      {
        id: 1,
        type: "booking_request",
        message: "New booking request from John Doe",
        timestamp: "2024-03-20T10:30:00",
        read: false,
        details: {
          ownerId: "123",
          ownerName: "John Doe",
          startDate: "2024-03-25",
          numberOfDays: 3,
          message: "Need a driver for a family trip",
        },
      },
      // Add more mock notifications as needed
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
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
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                      {notification.type === "booking_request" && (
                        <div className="mt-2">
                          <p className="text-sm">
                            Start Date: {notification.details.startDate}
                          </p>
                          <p className="text-sm">
                            Duration: {notification.details.numberOfDays} days
                          </p>
                          <p className="text-sm italic mt-1">
                            "{notification.details.message}"
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                              Accept
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                              Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <span className="bg-blue-500 w-2 h-2 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
