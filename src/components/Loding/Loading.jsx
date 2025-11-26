import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
      </div>
    </div>
  );
};

export default Loading;


