import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const STORAGE_BASE = 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image';

const games = [
    {
        id: 1,
        title: "Marvel's Spider-Man",
        image: `${STORAGE_BASE}/images/spider-man-ps4-game-swinging-through-city.webp`,
        video: `${STORAGE_BASE}/video/Marvel's-Spider-Man-1.mp4`,
        description: "Sumérgete en el universo de Spider-Man con una historia original. Balancea por Manhattan, combate el crimen y enfrenta villanos icónicos en esta aventura épica de mundo abierto.",
        platform: "PS4",
        year: 2018,
        rating: 4.9,
        features: ["Ray Tracing", "60 FPS", "4K HDR", "Mundo Abierto"],
        buyLink: "https://www.playstation.com/es-mx/games/marvels-spider-man/"
    },
    {
        id: 2,
        title: "Spider-Man: Miles Morales",
        image: `${STORAGE_BASE}/images/miles-morales-spider-man-game-electric-powers.webp`,
        video: `${STORAGE_BASE}/video/Spiderma-Miles-morales.mp4`,
        description: "Experimenta el poder eléctrico de Miles Morales en su primera aventura como Spider-Man. Nuevas habilidades de Venom y camuflaje te esperan en un Nueva York nevado.",
        platform: "PS5",
        year: 2020,
        rating: 4.8,
        features: ["Ray Tracing", "120 FPS", "4K Native", "Haptic Feedback"],
        buyLink: "https://www.playstation.com/es-mx/games/marvels-spider-man-miles-morales/"
    },
    {
        id: 3,
        title: "Marvel's Spider-Man 2",
        image: `${STORAGE_BASE}/images/spider-man-2-ps5-peter-and-miles-dual-heroes.webp`,
        video: `${STORAGE_BASE}/video/Marvel's-Spider-Man-2.mp4`,
        description: "Peter Parker y Miles Morales se unen en la aventura más grande. Enfrenta a Venom, explora Queens y Brooklyn, y domina el simbionte en esta secuela revolucionaria.",
        platform: "PS5",
        year: 2023,
        rating: 5.0,
        features: ["Ray Tracing", "60 FPS", "4K Ultra", "Dual Protagonists"],
        buyLink: "https://www.playstation.com/es-mx/games/marvels-spider-man-2/"
    }
];

const Trilogy = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    // Function to handle video interaction
    const handleVideoInteraction = (e) => {
        const card = e.currentTarget.closest('.game-card');
        if (!card) return;

        // Si ya está activo, no hacemos nada (permitimos que los controles funcionen)
        if (card.classList.contains('mobile-active')) return;

        // Desactivar otros
        document.querySelectorAll('.game-card').forEach(c => {
            if (c !== card) {
                c.classList.remove('mobile-active');
                const v = c.querySelector('video');
                if (v) v.controls = false;
            }
        });

        // Activar este
        card.classList.add('mobile-active');
        
        const video = card.querySelector('video');
        if (video) {
            video.controls = true;
            video.play().catch(err => console.log('Playback error:', err));
        }
    };

    return (
        <section id="games" className="games-section py-5" role="region" aria-labelledby="games-title">
            <div className="container py-5">
                <h2 id="games-title" className="section-title brutalist-text text-center mb-5" data-aos="fade-up">
                    LA TRILOGÍA COMPLETA
                </h2>

                <div className="row g-4">
                    {games.map((game, index) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={game.id} data-aos="fade-up" data-aos-delay={index * 100}>
                            <article className="game-card neomorph">
                                <div
                                    className="game-media-wrapper"
                                    onClick={(e) => handleVideoInteraction(e, game.id)}
                                >
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        className="game-image"
                                        loading={index < 3 ? 'eager' : 'lazy'}
                                    />

                                    <video
                                        className="game-video"
                                        playsInline
                                        muted
                                        loop
                                        autoPlay
                                        preload="metadata"
                                        poster={game.image}
                                        crossOrigin="anonymous"
                                    >
                                        <source src={game.video} type="video/mp4" />
                                        Tu navegador no soporta el elemento de video.
                                    </video>

                                    <div className="game-platform">
                                        <span className="badge neomorph">
                                            <i className="fab fa-playstation" aria-hidden="true"></i> {game.platform}
                                        </span>
                                    </div>

                                    <div className="video-indicator">
                                        <i className="fas fa-play-circle" aria-hidden="true"></i>
                                        <span>Click o Tap para ver</span>
                                    </div>
                                </div>

                                <div className="game-content">
                                    <h3>{game.title}</h3>
                                    <p>{game.description}</p>

                                    <div className="game-features" role="list">
                                        {game.features.map((feature, i) => (
                                            <span className="feature-badge" role="listitem" key={i}>{feature}</span>
                                        ))}
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="rating">
                                            <i className="fas fa-star text-warning" aria-hidden="true"></i>
                                            <span className="ms-1 fw-bold">{game.rating}</span>
                                            <span className="text-muted">/5.0</span>
                                        </div>
                                        <div className="text-muted">
                                            <i className="far fa-calendar" aria-hidden="true"></i>
                                            <span className="ms-1">{game.year}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-game"
                                        onClick={() => window.open(game.buyLink, '_blank', 'noopener,noreferrer')}
                                    >
                                        <i className="fab fa-playstation me-2" aria-hidden="true"></i>
                                        Comprar Ahora
                                    </button>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trilogy;
