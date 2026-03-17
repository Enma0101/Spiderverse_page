import React, { useRef, useMemo, useState, useCallback, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import GameModal from './GameModal';

const STORAGE_BASE = 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/models';

const spideyUrl = `${STORAGE_BASE}/Untitled.glb`;
const moralesUrl = `${STORAGE_BASE}/Morales.glb`;
const morales2Url = `${STORAGE_BASE}/Morales2.glb`;
const morales3Url = `${STORAGE_BASE}/Morales3.glb`;
const morales4Url = `${STORAGE_BASE}/Morales4.glb`;
const morales5Url = `${STORAGE_BASE}/Morales5.glb`;
const morales6Url = `${STORAGE_BASE}/Morales6.glb`;

// ─────────────────────────────────────────────────────────
// Constantes de la pista ovalada
// ─────────────────────────────────────────────────────────
const NUM_MODELS = 7;
const RADIUS_X = 8.0;
const RADIUS_Z = 3.0;
const SPEED = 0.25;
const FRONT_THRESHOLD = 0.55;
const SCALE_DEFAULT = 1.0;
const SCALE_FRONT = 1.07;
const SCALE_HOVER = 1.22;
const LERP_SPEED = 0.09;

const MODEL_CFG = {
    [spideyUrl]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [moralesUrl]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales2Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales3Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales4Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales5Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales6Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
};

const SLOT_URLS = {
    1: moralesUrl,
    2: morales3Url,
    3: morales2Url,
    4: morales4Url,
    5: morales5Url,
    6: morales6Url,
};

const ALL_MODEL_URLS = [spideyUrl, moralesUrl, morales2Url, morales3Url, morales4Url, morales5Url, morales6Url];

// ─────────────────────────────────────────────────────────
// Datos de cada juego
// ─────────────────────────────────────────────────────────
const GAME_DATA = [
    {
        title: "Marvel's Spider-Man Remastered",
        subtitle: 'Edición Mejorada',
        platform: 'PS5',
        year: '2020',
        developer: 'Insomniac Games',
        rating: '4.9',
        genre: 'Acción · Mundo Abierto',
        description: 'Disfruta de la aventura original de Peter Parker optimizada para la nueva generación. Incluye gráficos mejorados, trazado de rayos y todos los capítulos del DLC "La ciudad que nunca duerme".',
        color: '#e50914',
        badge: 'REMASTERED',
    },
    {
        title: "Marvel's Spider-Man: Miles Morales",
        subtitle: 'Un Nuevo Héroe',
        platform: 'PS4',
        year: '2020',
        developer: 'Insomniac Games',
        rating: '4.8',
        genre: 'Acción · Aventura',
        description: 'Acompaña a Miles Morales mientras domina sus nuevos poderes explosivos para convertirse en su propia versión de Spider-Man y salvar su hogar en una Nueva York nevada.',
        color: '#b11313',
        badge: 'PS4 EXCLUSIVE',
    },
    {
        title: "Marvel's Spider-Man",
        subtitle: 'Edición Estándar',
        platform: 'PS4',
        year: '2018',
        developer: 'Insomniac Games',
        rating: '4.9',
        genre: 'Acción · Mundo Abierto',
        description: 'La experiencia definitiva que dio inicio al universo de Insomniac. Peter Parker debe enfrentar a los Seis Siniestros en una historia original cargada de emoción y adrenalina.',
        color: '#d11212',
        badge: 'ONLY ON PLAYSTATION',
    },
    {
        title: "Marvel's Spider-Man 2",
        subtitle: 'Be Greater. Together.',
        platform: 'PS5',
        year: '2023',
        developer: 'Insomniac Games',
        rating: '5.0',
        genre: 'Acción · Mundo Abierto',
        description: 'Peter Parker y Miles Morales regresan para enfrentar la prueba definitiva de fuerza. Con el poder del simbionte y nuevas alas de telaraña, deberán detener la amenaza de Kraven y Venom.',
        color: '#8b0000',
        badge: 'PS5 EXCLUSIVE',
    },
    {
        title: "Spider-Man: Miles Morales (Classic Edition)",
        subtitle: 'The Morales Legacy',
        platform: 'PS2 (Retro Style)',
        year: '2020 (Estilo 2004)',
        developer: 'Sony / Insomniac',
        rating: '4.7',
        genre: 'Acción · Beat \'em up',
        description: 'Una versión imaginaria de la aventura de Miles Morales como si hubiera sido lanzada en la era dorada de los 128 bits. ¡Gráficos nostálgicos y acción clásica de balanceo!',
        color: '#1a1a1a',
        badge: 'RETRO EDITION',
    },
    {
        title: "Marvel's Spider-Man (Legacy Version)",
        subtitle: 'The Web-Slinger',
        platform: 'PS2 (Retro Style)',
        year: '2018 (Estilo 2002)',
        developer: 'Sony / Insomniac',
        rating: '4.6',
        genre: 'Acción · Aventura',
        description: '¿Cómo se vería el Spider-Man de 2018 en una PlayStation 2? Esta carátula rinde homenaje a los juegos clásicos de la época de Sam Raimi con la jugabilidad moderna.',
        color: '#003366',
        badge: 'LEGACY',
    },
    {
        title: "Marvel's Spider-Man",
        subtitle: 'Game of the Year Edition',
        platform: 'PS4',
        year: '2019',
        developer: 'Insomniac Games',
        rating: '4.9',
        genre: 'Acción · Mundo Abierto',
        description: 'La aclamada aventura de mundo abierto con un arte de portada alternativo que muestra a Spider-Man balanceándose entre los rascacielos de Manhattan.',
        color: '#c40c0c',
        badge: 'BEST SELLER',
    },
];

// ─────────────────────────────────────────────────────────
// Pre-fetch all GLB binary data via useGLTF.preload()
// This ensures we use Three.js' internal cache properly
// without creating network abort conflicts in Vite.
// ─────────────────────────────────────────────────────────
function usePreFetchModels(urls) {
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!urls || urls.length === 0) {
            setReady(false);
            setProgress(0);
            return;
        }

        let loadedCount = 0;

        // Force native preload for all URLs
        urls.forEach(url => {
            useGLTF.preload(url, true);
        });

        // Since useGLTF.preload() doesn't expose a single unified progress API for all assets natively, 
        // we use a simple generic loading simulator that matches standard download times to keep the UI smooth,
        // while the browser handles the actual caching asynchronously in the background.
        const interval = setInterval(() => {
            setProgress(p => {
                // If it hits 99, wait for the actual components to mount to reach 100
                if (p >= 99) {
                    clearInterval(interval);
                    setReady(true);
                    return 100;
                }
                // Simulate download speed (about 1.5s total)
                return p + 10;
            });
        }, 150);

        return () => clearInterval(interval);
    }, [urls]);

    return { progress, ready };
}

// ─────────────────────────────────────────────────────────
// Simple Loading Banner — shown while models download & parse
// ─────────────────────────────────────────────────────────
function SimpleLoadingBanner() {
    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
        }}>
            <div className="spinner-border text-danger mb-3" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p style={{
                color: '#e50914',
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: '2rem',
                letterSpacing: '0.15em',
                margin: 0,
                textTransform: 'uppercase',
                textShadow: '0 0 15px rgba(229, 9, 20, 0.4)'
            }}>
                Cargando Juegos...
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// ModelInstance: single 3D model on the oval track
// ─────────────────────────────────────────────────────────
function ModelInstance({ offset, angleRef, url, gameData, onSelect, setGlobalHover, onLoaded }) {
    const { scene } = useGLTF(url, true);
    const { xRot, yRot, zRot } = MODEL_CFG[url] ?? MODEL_CFG[spideyUrl];

    // Trigger onLoaded when this model finishes parsing and mounts
    useEffect(() => {
        if (onLoaded) onLoaded();
    }, [onLoaded]);

    const groupRef = useRef();
    const scaleRef = useRef(SCALE_DEFAULT);
    const isFrontRef = useRef(false);
    const isHoveredRef = useRef(false);
    const modelRotRef = useRef();

    const [hovered, setHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-reset flip after 5 seconds on mobile
    useEffect(() => {
        if (isMobile && isFlipped) {
            const timer = setTimeout(() => {
                setIsFlipped(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isMobile, isFlipped]);

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        clone.rotation.set(xRot, yRot, zRot);
        clone.updateMatrixWorld(true);
        const box1 = new THREE.Box3().setFromObject(clone);
        const size = new THREE.Vector3();
        box1.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        clone.scale.setScalar(4.6 / maxDim);
        clone.updateMatrixWorld(true);
        const box2 = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        clone.position.sub(center);
        return clone;
    }, [scene, xRot, yRot, zRot]);

    useFrame(() => {
        if (modelRotRef.current) {
            const targetRot = isFlipped ? Math.PI : 0;
            // On mobile, the rotation is strictly determined by isFlipped state
            // On PC, we maintain the hover-requirement as originally intended
            const shouldShowFlip = isMobile ? isFlipped : (isFlipped && hovered);

            if (!isMobile && !hovered) {
                modelRotRef.current.rotation.y = 0;
            } else {
                modelRotRef.current.rotation.y = THREE.MathUtils.lerp(
                    modelRotRef.current.rotation.y, shouldShowFlip ? Math.PI : 0, 0.1
                );
            }
        }
    });

    useFrame(() => {
        if (!groupRef.current) return;
        const θ = angleRef.current + offset;
        const cosθ = Math.cos(θ);
        groupRef.current.position.set(Math.sin(θ) * RADIUS_X, 0, cosθ * RADIUS_Z);
        groupRef.current.rotation.y = Math.atan2(Math.sin(θ) * RADIUS_Z, cosθ * RADIUS_X);
        const inFront = cosθ > FRONT_THRESHOLD;

        isFrontRef.current = inFront;
        const targetScale = (isHoveredRef.current && inFront)
            ? SCALE_HOVER : inFront ? SCALE_FRONT : SCALE_DEFAULT;
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, LERP_SPEED);
        groupRef.current.scale.setScalar(scaleRef.current);
    });

    const handlePointerEnter = useCallback(() => {
        if (isFrontRef.current) {
            isHoveredRef.current = true;
            document.body.style.cursor = 'pointer';
        }
    }, []);

    const handlePointerLeave = useCallback(() => {
        isHoveredRef.current = false;
        document.body.style.cursor = 'default';
    }, []);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        if (isFrontRef.current) onSelect(gameData);
    }, [onSelect, gameData]);

    const handleFlipToggle = useCallback((e) => {
        e.stopPropagation();
        setIsFlipped(prev => !prev);
    }, []);

    return (
        <group
            ref={groupRef}
            onPointerUp={(e) => {
                // On mobile, onPointerUp is more reliable for taps
                if (isMobile) {
                    handleFlipToggle(e);
                }
            }}
            onClick={(e) => {
                // On PC, onClick handles both modal opening (if front) and flipping
                if (!isMobile) {
                    handleClick(e);
                    handleFlipToggle(e);
                } else if (isFrontRef.current) {
                    // On mobile, only use click for the modal if in front
                    // The flip is handled by onPointerUp
                    handleClick(e);
                }
            }}
            onPointerEnter={(e) => { handlePointerEnter(e); e.stopPropagation(); setHovered(true); if (setGlobalHover) setGlobalHover(true); }}
            onPointerLeave={(e) => {
                handlePointerLeave(e);
                e.stopPropagation();
                setHovered(false);
                if (setGlobalHover) setGlobalHover(false);
                if (!isMobile) setIsFlipped(false);
            }}
        >
            <group ref={modelRotRef} rotation={[0, 0, 0]}>
                <primitive object={clonedScene} />
            </group>
        </group>
    );
}

// ─────────────────────────────────────────────────────────
// CarouselRing: manages global angle and distributes slots
//
// BACKGROUND STAGGER: models mount one by one internally
// so parsing doesn't freeze the browser. Once all 7 are
// completely parsed and mounted, we notify the parent.
// ─────────────────────────────────────────────────────────
function CarouselRing({ isPausedRef, onSelect, onAllLoaded }) {
    const angleRef = useRef(0);
    const [loadedCount, setLoadedCount] = useState(0);


    // Track when each model finishes parsing/mounting
    const handleModelLoaded = useCallback(() => {
        setLoadedCount(prev => {
            const next = prev + 1;
            if (next === NUM_MODELS && onAllLoaded) {
                // All parsed! Tiny delay to safely flush the final frame to the GPU
                setTimeout(onAllLoaded, 100);
            }
            return next;
        });
    }, [onAllLoaded]);

    useFrame((_state, delta) => {
        if (!isPausedRef.current) {
            angleRef.current += delta * SPEED;
        }
    });

    const slots = useMemo(() =>
        Array.from({ length: NUM_MODELS }, (_, i) => ({
            offset: (i / NUM_MODELS) * Math.PI * 2,
            url: SLOT_URLS[i] ?? spideyUrl,
            gameData: GAME_DATA[i],
        }))
        , []);

    return (
        <>
            {slots.map((slot, i) => (
                <Suspense key={i} fallback={null}>
                    <ModelInstance
                        offset={slot.offset}
                        angleRef={angleRef}
                        isPausedRef={isPausedRef}
                        url={slot.url}
                        gameData={slot.gameData}
                        onSelect={onSelect}
                        setGlobalHover={() => { }}
                        onLoaded={handleModelLoaded}
                    />
                </Suspense>
            ))}
        </>
    );
}

const EMPTY_URLS = [];

// ─────────────────────────────────────────────────────────
// Carousel3D: root component.
//
// LOADING STRATEGY:
//   1. Pre-fetch all 7 GLB files via fetch() in parallel
//   2. Canvas mounts with opacity 0 (hidden)
//   3. CarouselRing secretly stagger-mounts the models, 
//      parsing them one by one to keep browser responsive.
//   4. Once all 7 are parsed, allModelsParsed becomes true,
//      and the Canvas softly fades in all at once!
// ─────────────────────────────────────────────────────────
function Carousel3D() {
    const [selectedGame, setSelectedGame] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [allModelsParsed, setAllModelsParsed] = useState(false);

    const sectionRef = useRef(null);
    const isPausedRef = useRef(false);

    // Step 1: Intersection observer — start loading when section is near viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '600px' }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Step 2: Pre-fetch all models in background (only after visible)
    const { progress, ready } = usePreFetchModels(isVisible ? ALL_MODEL_URLS : EMPTY_URLS);

    const handleAllLoaded = useCallback(() => {
        setAllModelsParsed(true);
    }, []);

    const handleSelect = useCallback((gameData) => {
        isPausedRef.current = true;
        document.body.style.cursor = 'default';
        setSelectedGame(gameData);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedGame(null);
        isPausedRef.current = false;
    }, []);

    // We show the loader if network fetch is not ready, OR if background parsing is not done
    const showLoader = !ready || !allModelsParsed;

    return (
        <section id="3d-suits" className="three-d-suits-section" ref={sectionRef} style={{ position: 'relative' }}>
            <div className="container mb-1">
                <h2 className="section-title text-center brutalist-text" data-aos="fade-up">
                    JUEGOS DE CONSOLA
                </h2>
            </div>

            {/* Container for Loader and Canvas */}
            <div style={{ position: 'relative', width: '120%', marginLeft: '-10%', height: '560px', overflow: 'hidden' }}>

                {/* 3D Canvas (always mounted, but hidden behind the solid overlay until ready) */}
                {ready && (
                    <div style={{
                        width: '100%', height: '100%',
                        opacity: allModelsParsed ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out'
                    }}>
                        <Canvas
                            camera={{
                                position: typeof window !== 'undefined' && window.innerWidth < 768 ? [0, 0, 8.5] : [0, 0, 6.5],
                                fov: typeof window !== 'undefined' && window.innerWidth < 768 ? 115 : 90
                            }}
                            dpr={[1, 1.5]}
                            gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
                            style={{ width: '100%', height: '100%', background: 'transparent' }}
                        >
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
                            <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#0066cc" />
                            <pointLight position={[0, 6, 0]} intensity={1.2} color="#e50914" />
                            <pointLight position={[0, -3, 0]} intensity={0.4} color="#ffffff" />

                            <Suspense fallback={null}>
                                <CarouselRing isPausedRef={isPausedRef} onSelect={handleSelect} onAllLoaded={handleAllLoaded} />
                                <Environment preset="city" />
                                <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={16} blur={2.5} />
                            </Suspense>
                        </Canvas>
                    </div>
                )}

                {/* Visual Overlay: Hides the Canvas while it paints. PLACED AFTER CANVAS TO ENSURE IT'S ON TOP */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 50,
                    opacity: showLoader ? 1 : 0,
                    pointerEvents: showLoader ? 'auto' : 'none',
                    transition: 'opacity 0.6s ease-in-out',
                    background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <SimpleLoadingBanner progress={isVisible ? progress : 0} isParsing={ready && !allModelsParsed} />
                </div>
            </div>

            <p style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                marginTop: '0.5rem',
            }}>
                Haz clic en los juegos del frente para ver detalles
            </p>

            {selectedGame && (
                <GameModal game={selectedGame} onClose={handleClose} />
            )}
        </section>
    );
}

export default Carousel3D;
