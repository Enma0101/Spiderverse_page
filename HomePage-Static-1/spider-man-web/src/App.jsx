import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Comics from './pages/Comics';
import Chatbot from './components/chatbot/Chatbot';

function Home() {
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

    // Forzar que la página siempre cargue desde arriba y desactivar restauracion automatica del navegador
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout onOpenAuth={() => setIsAuthOpen(true)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comics" element={<Comics />} />
      </Routes>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <Chatbot />
    </Layout>
  );
}

export default App;
