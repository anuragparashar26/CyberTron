import React, { useState, useEffect } from 'react';

const Notifications = ({ notifications }) => {
    const [visibleNotifications, setVisibleNotifications] = useState([]);

    useEffect(() => {
        setVisibleNotifications(notifications);
        const timer = setTimeout(() => setVisibleNotifications([]), 5000);
        return () => clearTimeout(timer);
    }, [notifications]);

    return (
        <div className="fixed top-4 right-4 space-y-2">
            {visibleNotifications.map((note, index) => (
                <div
                    key={index}
                    className="bg-gray-800 text-green-400 p-3 rounded shadow-lg"
                >
                    {note}
                </div>
            ))}
        </div>
    );
};

export default Notifications;
