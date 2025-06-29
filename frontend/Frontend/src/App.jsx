import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Components/Header';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <Header />

      {/* Main content fills rest of screen */}
      <main className="flex-grow w-full bg-gray-900 text-white">
  <Outlet />
</main>

    </div>
  );
}

export default App;
