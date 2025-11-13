import React from 'react';
import { InteractiveCubeScene } from './components/InteractiveCubeScene';

function App() {
  return (
    <main className="relative w-screen h-screen bg-gray-900 text-white flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 p-8 z-10 pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Interactive 3D Cube
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          Click and drag to rotate.
        </p>
      </div>
      <div className="w-full h-full">
        <InteractiveCubeScene />
      </div>
    </main>
  );
}

export default App;
