import React, { useEffect } from 'react';
import SpiderFacts from '../components/SpiderFacts';
import CharacterBios from '../components/CharacterBios';
import SpotifyPlayer from '../components/SpotifyPlayer';
import UniverseTimeline from '../components/UniverseTimeline';
import UniverseWallpapers from '../components/UniverseWallpapers';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './UniversePage.css';

const UniversePage = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="universe-page">
            {/* Cabecera temática */}
            <header className="universe-hero py-5">
                <div className="container text-center pt-5">
                    <h1 className="display-1 brutalist-text text-white mb-3" data-aos="fade-up">
                        EXPLORA EL UNIVERSO
                    </h1>
                    <p className="lead text-white-50" data-aos="fade-up" data-aos-delay="100">
                        Sumérgete en el lore, la historia y los secretos de tus arácnidos favoritos.
                    </p>
                </div>
            </header>

            <main className="container py-5">
                <div className="row g-5">
                    {/* Spider Facts Side */}
                    <div className="col-lg-5" data-aos="fade-right">
                        <div className="sticky-top" style={{ top: '120px' }}>
                            <SpiderFacts />
                            
                            <div className="info-promo neomorph p-4 mt-4">
                                <h4 className="brutalist-text mb-3">CONEXIÓN ARÁCNIDA</h4>
                                <p className="small text-muted">
                                    Esta sección se actualiza periódicamente con nuevos datos del multiverso.
                                    ¡Vuelve pronto para más revelaciones!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-7">
                        <CharacterBios />
                        
                        <UniverseTimeline />

                        <UniverseWallpapers />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UniversePage;
