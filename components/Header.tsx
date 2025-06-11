import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-sky-400">
          VidAI
        </h1>
        <p className="text-sm text-gray-400">Unlock insights from your videos. Ask questions, get answers.</p>
      </div>
    </header>
  );
};