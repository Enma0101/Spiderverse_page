import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import Layout from './components/Layout';
import Hero from './components/Hero';
import Trilogy from './components/Trilogy';
import Carousel3D from './components/Carousel3D';
import Features from './components/Features';
import Gallery from './components/Gallery';
import AuthModal from './components/AuthModal';

// Pages
import ComicsPage from './pages/ComicsPage';

function HomePage() {
  return (
    <>
      <Hero />
      <Trilogy />
      <Carousel3D />
      <Features />
      <Gallery />
    </>
  );
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <BrowserRouter>
      <Layout onOpenAuth={() => setIsAuthOpen(true)}>
        <Routes>
          <Route path="/" element={<HomePage onOpenAuth={() => setIsAuthOpen(true)} />} />
          <Route path="/comics" element={<ComicsPage />} />
        </Routes>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
