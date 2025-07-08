
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
      <p className="mt-4 text-slate-300">AI is analyzing the artifacts...</p>
    </div>
  );
};

export default Loader;
