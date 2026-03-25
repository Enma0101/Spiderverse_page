import React from 'react';
const logoPlay = 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/logoplay.webp';

const Hero = () => {
    const handleScrollClick = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        /* Original ID and Classes */
        <section id="home" className="hero-section" role="region" aria-labelledby="hero-title">
            {/* Contenedor independiente para Spider-Man */}
            <div className="hero-image-container"></div>

            <div className="hero-content container">
                <div className="row align-items-start min-vh-100 hero-row">
                    <div className="col-lg-6 hero-text" data-aos="fade-right">
                        {/* PlayStation Logo (Top - Mobile Only) */}
                        <div className="platform-logo mb-4 d-lg-none">
                            <img
                                src={logoPlay}
                                alt="PlayStation"
                                className="hero-ps-logo"
                            />
                        </div>

                        <h1 id="hero-title" className="display-1 brutalist-text mb-4">
                            <span className="text-gradient">TU VECINO <br /> AMIGABLE</span>
                        </h1>
                        <p className="lead mb-5 text-white">
                            Experimenta la emoción de ser Spider-Man con la trilogía completa
                            disponible en PlayStation 4 y PlayStation 5. Gráficos increíbles,
                            historia envolvente y acción sin límites.
                        </p>
                        <div className="cta-buttons">
                            <a
                                href="#games"
                                onClick={(e) => handleScrollClick(e, 'games')}
                                className="btn btn-primary btn-lg neomorph me-3"
                            >
                                <i className="fab fa-playstation me-2" aria-hidden="true"></i>
                                Ver Juegos
                            </a>
                            <a
                                href="#gallery"
                                onClick={(e) => handleScrollClick(e, 'gallery')}
                                className="btn btn-outline-light btn-lg neomorph"
                            >
                                <i className="fas fa-images me-2" aria-hidden="true"></i>
                                Galería
                            </a>
                        </div>

                        {/* PlayStation Logo (Bottom - PC Only) */}
                        <div className="platform-logo mt-5 d-none d-lg-block">
                            <img
                                src={logoPlay}
                                alt="PlayStation"
                                className="hero-ps-logo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <a
                    href="#games"
                    onClick={(e) => handleScrollClick(e, 'games')}
                    aria-label="Scroll to games section"
                >
                    <i className="fas fa-chevron-down" aria-hidden="true"></i>
                </a>
            </div>
        </section>
    );
};

export default Hero;
