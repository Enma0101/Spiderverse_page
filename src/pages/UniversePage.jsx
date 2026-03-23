import React, { useEffect } from 'react';
import SpiderFacts from '../components/SpiderFacts';
import CharacterBios from '../components/CharacterBios';
import SoundtrackCards from '../components/SoundtrackCards';
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
                <div className="container hero-content-inner">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-7 text-start">
                            <h1 className="universe-title brutalist-text text-white" data-aos="fade-up">
                                EXPLORA EL <br /> SPIDER-VERSE
                            </h1>
                            <p className="universe-subtitle text-white" data-aos="fade-up" data-aos-delay="100">
                                Sumérgete en el lore, la historia y los secretos de tus arácnidos favoritos.
                            </p>
                        </div>
                        <div className="col-lg-5 d-flex justify-content-end" data-aos="fade-left" data-aos-delay="200">
                            <SpiderFacts />
                        </div>
                    </div>
                </div>
            </header>

            <main className="universe-main">
                <div className="bg-secondary">
                    <CharacterBios />
                </div>

                {/* Integrating the new SoundtrackCards section */}
                <div style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <SoundtrackCards />
                </div>

                <div className="bg-console-section">
                    <UniverseTimeline />
                </div>
            </main>
        </div>
    );
};

export default UniversePage;
