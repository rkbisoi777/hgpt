import React from 'react';

interface ProgressBarProps {
  percentage?: number; // Progress percentage (0-100), optional
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage = -1 }) => {
  // Determine the color based on the percentage
  const getColor = (percentage: number): string => {
    // if (percentage == -1) return 'bg-gray-200';
    if (percentage <= 25) return 'bg-red-600';
    if (percentage <= 50) return 'bg-orange-500';
    if (percentage <= 75) return 'bg-green-500';
    return 'bg-green-800';
  };

  // Get the color class based on the percentage
  const colorClass = getColor(percentage);

  return (
    <div className="relative w-1/2 bg-gray-500 rounded-full shadow-lg">
      {/* Progress bar */}
      <div
        className={`${colorClass} h-4 rounded-full`}
        style={{ width: `${percentage}%` }}
      ></div>

      {/* Text overlay */}
      {(percentage != -1) ? (
      <div className="absolute top-0 left-0 w-full h-4 flex items-center justify-center text-[11px] font-medium text-white">
        {percentage}% Match
      </div>
    ) : (
      <div className="absolute top-0 left-0 w-full h-4 flex items-center justify-center text-[11px] font-medium text-white">
        No Score
      </div>
      )}
    </div>
  );
};

export default ProgressBar;
