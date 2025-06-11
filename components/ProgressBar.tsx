import React from 'react';

interface ProgressBarProps {
  progress: number; // Percentage from 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress)); // Ensure progress is between 0 and 100

  return (
    <div className="w-full">
      <div
        className="w-full bg-gray-700 rounded-full h-2.5 my-1 relative overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Video processing progress: ${clampedProgress.toFixed(0)}%`}
        aria-busy={clampedProgress < 100}
        aria-live="polite"
      >
        <div
          className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
      <p className="text-xs text-center text-gray-400 mt-1">
        {clampedProgress.toFixed(0)}%
      </p>
    </div>
  );
};