import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} VidAI. Powered by Gemini.</p>
      </div>
    </footer>
  );
};