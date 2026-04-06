import React from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import LiquidBackground from './components/LiquidBackground';
import GlobalWormhole from './components/GlobalWormhole';

import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Routes, Route } from 'react-router-dom';

const Home = () => (
  <>
    <Hero />
    <Gallery />
    <Resume />
    <Contact />
  </>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen text-white flex flex-col font-sans">
          <div className="fixed inset-0 z-10 overflow-hidden bg-black pointer-events-none">
            <GlobalWormhole />
            <LiquidBackground />
          </div>
          <div className="relative z-20 flex flex-col min-h-screen">
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
