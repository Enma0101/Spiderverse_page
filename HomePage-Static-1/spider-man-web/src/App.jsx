import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext } from 'react';
import { AuthContext } from './context/authContextDef';

// Components
import Layout from './components/Layout';
import Hero from './components/Hero';
import Trilogy from './components/Trilogy';
import Features from './components/Features';
import Gallery from './components/Gallery';
import AuthModal from './components/AuthModal';
import Chatbot from './components/chatbot/Chatbot';

// Heavy 3D component — lazy loaded to avoid blocking initial render
const Carousel3D = React.lazy(() => import('./components/Carousel3D'));

// Pages (Lazy Loaded)
const ComicsPage = React.lazy(() => import('./pages/ComicsPage'));

// Loader Component for Suspense (full page)
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
    <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);


function HomePage() {
  return (
    <>
      <Hero />
      <Trilogy />
      <Suspense fallback={null}>
        <Carousel3D />
      </Suspense>
      <Features />
      <Gallery />
    </>
  );
}

function App() {
  const { isAuthOpen, setIsAuthOpen } = useContext(AuthContext);
  const location = useLocation();
  const isComicsRoute = location.pathname === '/comics';

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Sync scroll to top only when we transition pages, not on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout onOpenAuth={() => setIsAuthOpen(true)}>
      {/* 
        CRITICAL OPTIMIZATION: 
        We use 'display: none' instead of Routes to prevent the 3D Canvas (WebGL context) 
        from being destroyed and recreated when navigating between Home and Comics.
        This provides a 0ms instant transition.
      */}
      <div style={{ display: isComicsRoute ? 'none' : 'block' }}>
        <HomePage />
      </div>

      <div style={{ display: isComicsRoute ? 'block' : 'none' }}>
        {isComicsRoute && (
          <Suspense fallback={<PageLoader />}>
            <ComicsPage />
          </Suspense>
        )}
      </div>

      <Chatbot />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </Layout>
  );
}

export default App;
