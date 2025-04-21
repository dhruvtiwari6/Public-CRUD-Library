import React from 'react';

type NotificationProps = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  };

  return (
    <div className={`p-4 mb-4 rounded-lg border-l-4 ${bgColor[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;