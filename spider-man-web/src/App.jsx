import React, { useState, useEffect } from 'react';
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
import Chatbot from './components/chatbot/Chatbot';

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
    <Layout onOpenAuth={() => setIsAuthOpen(true)}>
      <Hero />
      <Trilogy />
      <Carousel3D />
      <Features />
      <Gallery />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <Chatbot />
    </Layout>
  );
}

export default App;
