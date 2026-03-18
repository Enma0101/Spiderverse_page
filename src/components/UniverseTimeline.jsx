import React from 'react';
import './UniverseTimeline.css';

const spiderVerseMovies = [
    {
        id: 'sv1',
        year: '2018',
        title: 'INTO THE SPIDER-VERSE',
        desc: 'Miles Morales adquiere superpoderes y se une a Spider-Men de diversas dimensiones para salvar el multiverso.',
        posParams: { top: '15%', left: '25%', flexDirection: 'row' },
        image: '/baner universo.webp'
    },
    {
        id: 'sv2',
        year: '2023',
        title: 'ACROSS THE SPIDER-VERSE',
        desc: 'Miles viaja por el multiverso y se encuentra con la Spider-Society, enfrentando un dilema sobre cómo salvar los mundos.',
        posParams: { top: '50%', left: '75%', flexDirection: 'row-reverse' },
        image: '/gwenstacy.jpg'
    },
    {
        id: 'sv3',
        year: '2027',
        title: 'BEYOND THE SPIDER-VERSE',
        desc: 'La épica conclusión donde Miles desafía el destino para proteger a quienes ama en una guerra multiversal sin precedentes.',
        posParams: { top: '85%', left: '30%', flexDirection: 'row' },
        image: '/mikemorales.webp'
    }
];

const WebNode = ({ image, id }) => (
    <div className="web-node-svg-wrapper">
        <svg viewBox="0 0 300 300" className="neon-web" aria-hidden="true">
            <defs>
                <clipPath id={`hex-clip-${id}`}>
                    <polygon points="150,20 262.58,85 262.58,215 150,280 37.42,215 37.42,85" />
                </clipPath>
            </defs>
            {/* Background Image using generic aspect ratio and custom hexagon clipping */}
            <image href={image} x="-50" y="-50" width="400" height="400" preserveAspectRatio="xMidYMid slice" clipPath={`url(#hex-clip-${id})`} opacity="0.85" />
            
            {/* Dark overlay for contrast */}
            <polygon points="150,20 262.58,85 262.58,215 150,280 37.42,215 37.42,85" className="web-overlay" />

            {/* Radials */}
            <line x1="150" y1="150" x2="150" y2="20" />
            <line x1="150" y1="150" x2="262.58" y2="85" />
            <line x1="150" y1="150" x2="262.58" y2="215" />
            <line x1="150" y1="150" x2="150" y2="280" />
            <line x1="150" y1="150" x2="37.42" y2="215" />
            <line x1="150" y1="150" x2="37.42" y2="85" />

            {/* Concentric Polygons */}
            <polygon points="150,106.6 187.5,128.3 187.5,171.6 150,193.3 112.5,171.6 112.5,128.3" fill="none" />
            <polygon points="150,63.3 225,106.6 225,193.3 150,236.6 75,193.3 75,106.6" fill="none" />
            <polygon points="150,20 262.58,85 262.58,215 150,280 37.42,215 37.42,85" fill="none" />
            
            {/* Chaotic details within the web */}
            <line x1="187.5" y1="128.3" x2="225" y2="193.3" strokeDasharray="6,4" className="chaos-web" />
            <line x1="112.5" y1="171.6" x2="75" y2="106.6" strokeDasharray="5,5" className="chaos-web" />
        </svg>
    </div>
);

const UniverseTimeline = () => {
    return (
        <section className="universe-timeline-neon pt-5 pb-10">
            <div className="container-fluid text-center">
                <h3 className="brutalist-text section-title mt-10 pt-7 mb-7 theme-title" data-aos="fade-down">
                    SPIDER-VERSE TRILOGY
                </h3>
            </div>
            
            <div className="timeline-web-container">
                {/* SVG Connecting Lines for Desktop */}
                <svg className="web-connections d-none d-lg-block" preserveAspectRatio="none">
                    <line x1="25%" y1="15%" x2="75%" y2="50%" />
                    <line x1="75%" y1="50%" x2="30%" y2="85%" />
                </svg>

                {spiderVerseMovies.map((movie, index) => (
                    <div 
                        key={movie.id} 
                        className="web-node-wrapper"
                        style={{
                            '--desktop-top': movie.posParams.top,
                            '--desktop-left': movie.posParams.left,
                            '--desktop-flex': movie.posParams.flexDirection,
                        }}
                        data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                        data-aos-delay={index * 200}
                    >
                        <div className="web-content-flex">
                            <WebNode image={movie.image} id={movie.id} />
                            
                            <div className="web-text-content neomorph">
                                <div className="timeline-header">
                                    <span className="movie-year">{movie.year}</span>
                                </div>
                                <h4 className="movie-title brutalist-text">{movie.title}</h4>
                                <p className="movie-desc mb-0">{movie.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UniverseTimeline;
