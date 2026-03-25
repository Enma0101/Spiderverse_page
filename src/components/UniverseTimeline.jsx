import React, { useState, useEffect, useRef } from 'react';
import './UniverseTimeline.css';

const spiderVerseMovies = [
    {
        id: 'sv1',
        year: '2018',
        title: 'INTO THE SPIDER-VERSE',
        desc: 'Miles Morales adquiere superpoderes y se une a Spider-Men de diversas dimensiones para salvar el multiverso.',
        posParams: { top: '15%', left: '30%', flexDirection: 'row' },
        image: '/itsv.jpg',
        imageParams: { x: "15", y: "25", width: "280", height: "250" }
    },
    {
        id: 'sv2',
        year: '2023',
        title: 'ACROSS THE SPIDER-VERSE',
        desc: 'Miles viaja por el multiverso y se encuentra con la Spider-Society, enfrentando un dilema sobre cómo salvar los mundos.',
        posParams: { top: '50%', left: '70%', flexDirection: 'row-reverse' },
        image: '/atsv.jpg',
        imageParams: { x: "0", y: "0", width: "320", height: "300" }
    },
    {
        id: 'sv3',
        year: '2027',
        title: 'BEYOND THE SPIDER-VERSE',
        desc: 'La épica conclusión donde Miles desafía el destino para proteger a quienes ama en una guerra multiversal sin precedentes.',
        posParams: { top: '85%', left: '35%', flexDirection: 'row' },
        image: '/btsv.jpg',
        imageParams: { x: "50", y: "50", width: "200", height: "200" }
    }
];

const spiderTrivia = [
    { q: "¿Verdadero o Falso? La araña que muerde a Miles Morales en Into the Spider-Verse proviene del universo 42.", a: true, expl: "Verdadero. La araña está etiquetada con el número 42, indicando su universo de origen." },
    { q: "¿Verdadero o Falso? Spider-Man 2099 (Miguel O'Hara) es uno de los pocos Spider-People que no posee sentido arácnido.", a: true, expl: "Verdadero. Se menciona que Miguel O'Hara carece de sentido arácnido y lo compensa con colmillos y tecnología." },
    { q: "¿Verdadero o Falso? Across the Spider-Verse es considerada la película animada estadounidense más larga hasta la fecha.", a: true, expl: "Verdadero. Con una duración de 140 minutos, ostenta ese récord." },
    { q: "¿Verdadero o Falso? El 'Buitre' renacentista que aparece al inicio de la segunda película proviene del mismo universo de Peter B. Parker.", a: false, expl: "Falso. El Buitre renacentista proviene de la Tierra-311." },
    { q: "¿Verdadero o Falso? En la película, Jessica Drew (Spider-Woman) es presentada como una mujer afroamericana embarazada.", a: true, expl: "Verdadero. A diferencia de los cómics, la versión de la película es una mujer negra embarazada." },
    { q: "¿Verdadero o Falso? Miles Morales usa el mismo traje durante toda la primera película Into the Spider-Verse.", a: false, expl: "Falso. Miles modifica su traje, pintándolo con spray antes de la batalla final." },
    { q: "¿Verdadero o Falso? Peter B. Parker se convierte en padre de una niña llamada Mayday.", a: true, expl: "Verdadero. Peter B. Parker aparece junto a su hija, Mayday Parker, en la secuela." },
    { q: "¿Verdadero o Falso? La voz de Gwen Stacy en las películas es interpretada por Zendaya.", a: false, expl: "Falso. La voz de Gwen Stacy (Spider-Gwen) es interpretada por Hailee Steinfeld." }
];

const WebNode = ({ image, id, nodeRef, imageParams }) => (
    <div className="web-node-svg-wrapper" ref={nodeRef}>
        <svg viewBox="0 0 300 300" className="neon-web" aria-hidden="true" style={{ overflow: 'visible' }}>
            <defs>
                <clipPath id={`hex-clip-${id}`}>
                    <polygon points="150,60 227.9,105 227.9,195 150,240 72.1,195 72.1,105" />
                </clipPath>
            </defs>

            {/* Outer hex geometry (radius 140) */}
            <polygon points="150,10 271.2,80 271.2,220 150,290 28.8,220 28.8,80" fill="none" opacity="0.4" strokeDasharray="5,10" />
            <polygon points="150,30 253.9,90 253.9,210 150,270 46.1,210 46.1,90" fill="none" opacity="0.2" />

            {/* Connecting lines from inner hex to outer hex */}
            <line x1="227.9" y1="105" x2="271.2" y2="80" opacity="0.5" />
            <line x1="227.9" y1="195" x2="271.2" y2="220" opacity="0.5" />
            <line x1="150" y1="240" x2="150" y2="290" opacity="0.5" />
            <line x1="72.1" y1="195" x2="28.8" y2="220" opacity="0.5" />
            <line x1="72.1" y1="105" x2="28.8" y2="80" opacity="0.5" />
            <line x1="150" y1="60" x2="150" y2="10" opacity="0.5" />

            {/* Background Image entirely fitted inside height boundaries to show completely */}
            <image href={image} x={imageParams?.x || "50"} y={imageParams?.y || "50"} width={imageParams?.width || "200"} height={imageParams?.height || "200"} preserveAspectRatio="xMidYMid meet" clipPath={`url(#hex-clip-${id})`} />

            {/* Dark overlay for contrast over inner hex */}
            <polygon points="150,60 227.9,105 227.9,195 150,240 72.1,195 72.1,105" className="web-overlay" />

            {/* Inner framing polygon */}
            <polygon points="150,60 227.9,105 227.9,195 150,240 72.1,195 72.1,105" fill="none" strokeWidth="4" />
        </svg>
    </div>
);
const UniverseTimeline = () => {
    const [activeNode, setActiveNode] = useState(null);
    const containerRef = useRef(null);
    const nodesRef = useRef([]);
    const [lines, setLines] = useState([]);
    
    // Trivia State
    const [trivia, setTrivia] = useState(null);
    const [answerStatus, setAnswerStatus] = useState(null);
    const [shatter, setShatter] = useState(false);

    // Particles State
    const [particles, setParticles] = useState([]);
    const [hoveredNode, setHoveredNode] = useState(null);

    useEffect(() => {
        setTrivia(spiderTrivia[Math.floor(Math.random() * spiderTrivia.length)]);
        // Generate robust particles layout
        setParticles(Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * 6 + 2}px`,
            duration: `${Math.random() * 8 + 8}s`,
            delay: `${Math.random() * 5}s`
        })));
    }, []);

    const handleAnswer = (choice) => {
        if (answerStatus) return;
        if (choice === trivia.a) {
            setAnswerStatus('correct');
        } else {
            setAnswerStatus('incorrect');
            setShatter(true);
        }
    };

    const toggleNode = (id) => {
        setActiveNode(prev => prev === id ? null : id);
    };

    useEffect(() => {
        let resizeObserver;

        const updateLines = () => {
            if (!containerRef.current || nodesRef.current.length < 3) return;
            if (!nodesRef.current[0] || !nodesRef.current[1] || !nodesRef.current[2]) return;

            const containerRect = containerRef.current.getBoundingClientRect();

            const getVertex = (nodeIndex, vertexAngleDeg) => {
                const el = nodesRef.current[nodeIndex];
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2 - containerRect.left;
                const centerY = rect.top + rect.height / 2 - containerRect.top;

                // SVG outer shape radius is 140 relative to 300px viewBox (center 150)
                const R = (rect.height / 2) * (140 / 150);
                const rad = vertexAngleDeg * (Math.PI / 180);

                return {
                    x: centerX + R * Math.cos(rad),
                    y: centerY + R * Math.sin(rad)
                };
            };

            // sv1 to sv2: From Bottom-Right (30 deg) to Top-Left (210 deg)
            const p1 = getVertex(0, 30);
            const p2 = getVertex(1, 210);

            // sv2 to sv3: From Bottom-Left (150 deg) to Top-Right (330 deg / -30 deg)
            const p3 = getVertex(1, 150);
            const p4 = getVertex(2, 330);

            setLines([
                { id: '1-to-2', x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y },
                { id: '2-to-3', x1: p3.x, y1: p3.y, x2: p4.x, y2: p4.y }
            ]);
        };

        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => {
                updateLines();
            });
            if (containerRef.current) resizeObserver.observe(containerRef.current);
            nodesRef.current.forEach(node => {
                if (node) resizeObserver.observe(node);
            });
        } else {
            window.addEventListener('resize', updateLines);
        }

        window.addEventListener('scroll', updateLines, { passive: true });

        // Initial setup and a delayed flush
        updateLines();
        const timeout = setTimeout(updateLines, 150);

        return () => {
            if (resizeObserver) resizeObserver.disconnect();
            window.removeEventListener('resize', updateLines);
            window.removeEventListener('scroll', updateLines);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <section className="universe-timeline-neon pt-5 pb-10">
            <div className="container-fluid text-center">
                <h3 className="brutalist-text section-title mt-10 pt-7 mb-7 theme-title" data-aos="fade-down">
                    SPIDER-VERSE TRILOGY
                </h3>
            </div>

            <div className={`timeline-web-container ${shatter ? 'shatter-mode' : ''} ${activeNode || hoveredNode ? 'particles-blue' : ''}`} ref={containerRef}>
                {/* Floating Particles Background layer */}
                <div className="particles-layer">
                    {particles.map(p => (
                        <div key={p.id} className="timeline-particle" style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            animationDuration: p.duration,
                            animationDelay: p.delay
                        }}/>
                    ))}
                </div>

                {/* Dynamic SVG Connecting Lines */}
                <svg className="web-connections" style={{ width: '100%', height: '100%' }}>
                    {lines.map(line => (
                        <line
                            key={line.id}
                            x1={line.x1}
                            y1={line.y1}
                            x2={line.x2}
                            y2={line.y2}
                        />
                    ))}
                </svg>

                {spiderVerseMovies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className={`web-node-wrapper ${movie.posParams.flexDirection === 'row' ? 'flex-row' : 'flex-row-reverse'} ${activeNode === movie.id ? 'active' : ''}`}
                        style={{
                            '--desktop-top': movie.posParams.top,
                            '--desktop-left': movie.posParams.left,
                            cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredNode(movie.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => toggleNode(movie.id)}
                    >
                        <div className="web-content-flex">
                            <WebNode
                                image={movie.image}
                                id={movie.id}
                                nodeRef={el => nodesRef.current[index] = el}
                                imageParams={movie.imageParams}
                            />

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

            {/* Trivia Section */}
            <div className="trivia-container container text-center mt-4 mt-md-10" data-aos="fade-up">
                {trivia && (
                    <div className="web-text-content neomorph mx-auto trivia-card" style={{ position: 'relative', width: '100%', maxWidth: '600px', top: 'auto', transform: 'none', opacity: 1, pointerEvents: 'auto', left: 'auto', right: 'auto' }}>
                        <h4 className="movie-title brutalist-text mb-3" style={{ fontSize: '1.4rem' }}>🔥 ALERTA DE ANOMALÍA 🔥</h4>
                        <p className="movie-desc mb-4">{trivia.q}</p>
                        
                        {!answerStatus ? (
                            <div className="d-flex justify-content-center gap-3">
                                <button className="trivia-btn btn-true" onClick={() => handleAnswer(true)}>VERDADERO</button>
                                <button className="trivia-btn btn-false" onClick={() => handleAnswer(false)}>FALSO</button>
                            </div>
                        ) : (
                            <div className={`trivia-result ${answerStatus}`}>
                                <h5 className="brutalist-text" style={{ color: answerStatus === 'correct' ? '#00d2ff' : '#ff2a00' }}>
                                    {answerStatus === 'correct' ? '¡CORRECTO! LÍNEA TEMPORAL SALVADA.' : '¡INCORRECTO! EL MULTIVERSO COLAPSA...'}
                                </h5>
                                <p className="movie-desc mt-2 mb-0" style={{ fontSize: '1rem' }}>{trivia.expl}</p>
                                {answerStatus === 'incorrect' && (
                                    <button className="trivia-btn btn-retry mt-4" onClick={() => {
                                        setAnswerStatus(null);
                                        setShatter(false);
                                        setTrivia(spiderTrivia[Math.floor(Math.random() * spiderTrivia.length)]);
                                        window.scrollTo({ top: containerRef.current.offsetTop, behavior: 'smooth' });
                                    }}>
                                        RESTAURAR LÍNEA TEMPORAL
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default UniverseTimeline;
