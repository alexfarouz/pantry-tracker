import { useEffect, useState } from 'react';

const LoadingBar = ({ duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const increment = 100 / (duration / 100); // Calculate the increment based on the duration

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + increment;
        if (nextProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return nextProgress;
      });
    }, 100); // Update progress every 100ms

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-200 z-50">
      <div className="w-1/2">
        <div className="text-center mb-3 text-5xl font-semibold text-gray-700">Pantry Tracker</div>
        <div className="h-2 bg-gray-200">
          <div className="w-3/4 h-full bg-blue-400" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;
