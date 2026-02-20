import React, { useRef, useMemo, useState, useCallback, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import GameModal from './GameModal';

import spideyUrl   from '../assets/Untitled.glb?url';
import moralesUrl  from '../assets/Morales.glb?url';
import morales2Url from '../assets/Morales2.glb?url';
import morales3Url from '../assets/Morales3.glb?url';
import morales4Url from '../assets/Morales4.glb?url';
import morales5Url from '../assets/Morales5.glb?url';
import morales6Url from '../assets/Morales6.glb?url';

// ─────────────────────────────────────────────────────────
// Constantes de la pista ovalada
// ─────────────────────────────────────────────────────────
const NUM_MODELS      = 7;
const RADIUS_X        = 8.0;   // ancho horizontal
const RADIUS_Z        = 3.0;   // profundidad
const SPEED           = 0.25;  // radianes/segundo

// Umbral de cos(θ): cuando cos(θ) > FRONT_THRESHOLD el modelo está al frente
// (valor más alto = zona frontal más estrecha)
const FRONT_THRESHOLD = 0.55;

// Escalas objetivo
const SCALE_DEFAULT   = 1.0;
const SCALE_FRONT     = 1.07;  // ligeramente agrandado en la zona frontal
const SCALE_HOVER     = 1.22;  // hover encima de un modelo frontal
const LERP_SPEED      = 0.09;  // suavidad de la interpolación de escala

// ─────────────────────────────────────────────────────────
// Rotación local de cada modelo (corrección de eje según GLB)
// ─────────────────────────────────────────────────────────
const MODEL_CFG = {
    [spideyUrl]:   { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [moralesUrl]:  { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales2Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales3Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales4Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales5Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
    [morales6Url]: { xRot: Math.PI / 2, yRot: 0, zRot: 0 },
};

// ─────────────────────────────────────────────────────────
// URL del modelo para cada slot del carrusel
// ─────────────────────────────────────────────────────────
const SLOT_URLS = {
    1: moralesUrl,
    2: morales3Url,
    3: morales4Url,
    4: morales2Url,
    5: morales5Url,
    6: morales6Url,
};

// ─────────────────────────────────────────────────────────
// Datos de cada juego (uno por slot)
// ─────────────────────────────────────────────────────────
const GAME_DATA = [
    {
        title:       "Marvel's Spider-Man",
        subtitle:    'Edición Definitiva',
        platform:    'PS4 / PS5',
        year:        '2018',
        developer:   'Insomniac Games',
        rating:      '4.9',
        genre:       'Acción · Mundo Abierto',
        description: 'Sé el Spider-Man definitivo en una épica aventura de mundo abierto por Manhattan. Como veterano Peter Parker, enfrenta a villanos icónicos mientras equilibras vida de héroe y ciudadano.',
        color:       '#e50914',
        badge:       'CLÁSICO',
    },
    {
        title:       "Spider-Man: Miles Morales",
        subtitle:    'Ultimate Edition',
        platform:    'PS5',
        year:        '2020',
        developer:   'Insomniac Games',
        rating:      '4.8',
        genre:       'Acción · Aventura',
        description: 'Miles Morales descubre el poder que lo hace diferente al proteger Harlem de una guerra entre una corporación corrupta y un ejército criminal. ¡El nuevo héroe arácnido ha llegado!',
        color:       '#0066cc',
        badge:       'NUEVO HÉROE',
    },
    {
        title:       "Marvel's Spider-Man 2",
        subtitle:    'La Próxima Amenaza',
        platform:    'PS5',
        year:        '2023',
        developer:   'Insomniac Games',
        rating:      '4.9',
        genre:       'Acción · Mundo Abierto',
        description: 'Peter y Miles regresan juntos para enfrentar a Kraven y Venom en el universo arácnido más grande jamás creado. El mayor capítulo de la saga Spider-Man hasta la fecha.',
        color:       '#c1001f',
        badge:       'ÉPICO',
    },
    {
        title:       'Spider-Man: Web of Shadows',
        subtitle:    'Symbiote Crisis',
        platform:    'PS3 / Xbox 360',
        year:        '2008',
        developer:   'Shaba Games',
        rating:      '4.2',
        genre:       'Acción · Aventura',
        description: 'Nueva York es invadida por simbiotes. Spider-Man debe elegir entre el traje clásico y el traje negro de Venom, donde cada decisión altera dramáticamente el rumbo de la historia.',
        color:       '#0070D1',
        badge:       'LEGENDARIO',
    },
    {
        title:       'The Amazing Spider-Man',
        subtitle:    'La Película · El Videojuego',
        platform:    'PS3 / Xbox 360 / PC',
        year:        '2012',
        developer:   'Beenox',
        rating:      '4.0',
        genre:       'Acción · Aventura',
        description: 'Basado en la película, Spider-Man enfrenta al Lagarto en las calles de Manhattan con mecánicas de combate evolucionadas y un sistema de sigilo renovado.',
        color:       '#0066cc',
        badge:       'PELÍCULA',
    },
    {
        title:       'Spider-Man: Shattered Dimensions',
        subtitle:    '4 Universos · 1 Héroe',
        platform:    'PS3 / Xbox 360',
        year:        '2010',
        developer:   'Beenox',
        rating:      '4.3',
        genre:       'Acción · Plataformas',
        description: 'Cuatro versiones de Spider-Man a través de dimensiones distintas: Amazing, Noir, 2099 y Ultimate. Una expedición única por el multiverso arácnido repleta de acción.',
        color:       '#e50914',
        badge:       'MULTIVERSO',
    },
    {
        title:       'Spider-Man: Edge of Time',
        subtitle:    'El Tiempo en Juego',
        platform:    'PS3 / Xbox 360',
        year:        '2011',
        developer:   'Beenox',
        rating:      '4.0',
        genre:       'Acción · Aventura',
        description: 'Amazing Spider-Man y Spider-Man 2099 cooperan entre épocas para salvar el futuro. Una historia de viajes en el tiempo y sacrificio que desafía los límites del universo.',
        color:       '#0070D1',
        badge:       'CROSSOVER',
    },
];

// ─────────────────────────────────────────────────────────
// ModelInstance: modelo 3D individual sobre la pista ovalada
//
// Props:
//   offset       – ángulo inicial del slot en la elipse (rad)
//   angleRef     – ref compartido con el ángulo global del carrusel
//   isPausedRef  – ref compartido: true cuando el carrusel está pausado
//   url          – URL del archivo .glb
//   gameData     – datos del juego para el modal
//   onSelect     – callback(gameData) cuando el usuario hace click al frente
// ─────────────────────────────────────────────────────────
function ModelInstance({ offset, angleRef, isPausedRef, url, gameData, onSelect }) {
    const { scene }            = useGLTF(url);
function ModelInstance({ position, yRotation, url, setGlobalHover }) {
    const { scene } = useGLTF(url);
    const { xRot, yRot, zRot } = MODEL_CFG[url] ?? MODEL_CFG[spideyUrl];

    const groupRef     = useRef();
    const scaleRef     = useRef(SCALE_DEFAULT);
    const isFrontRef   = useRef(false);
    const isHoveredRef = useRef(false);
    const groupRef = useRef();
    const modelRotRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);

        // 1. Corrección de ejes de exportación
        clone.rotation.set(xRot, yRot, zRot);
        clone.updateMatrixWorld(true);

        // 2. Escalar al tamaño objetivo
        const box1   = new THREE.Box3().setFromObject(clone);
        const size   = new THREE.Vector3();
        box1.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        clone.scale.setScalar(4.6 / maxDim);
        const scale = 2.4 / maxDim;
        clone.scale.setScalar(scale);
        clone.updateMatrixWorld(true);

        // 3. Centrar en el origen tras escalar
        const box2   = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        clone.position.sub(center);

        return clone;
    }, [scene, xRot, yRot, zRot]);

    useFrame((_state, delta) => {
        // Reducir la escala máxima de 1.10 a 1.05 para que no se corte
        const targetScale = hovered ? 1.05 : 1.0;
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        }

        // Animación suave del giro sobre sí mismo de 0 a 180 (Math.PI)
        if (modelRotRef.current) {
            const targetRot = isFlipped ? Math.PI : 0;

            // Si no estamos en hover, forzamos la rotación a 0 para quitar el efecto al salir
            if (!hovered) {
                modelRotRef.current.rotation.y = 0;
            } else {
                modelRotRef.current.rotation.y = THREE.MathUtils.lerp(
                    modelRotRef.current.rotation.y,
                    targetRot,
                    0.1 // Velocidad de la animación (menor es más lento)
                );
            }
        }
    });

    useFrame((_state, delta) => {
        // Reducir la escala máxima de 1.10 a 1.05 para que no se corte
        const targetScale = hovered ? 1.05 : 1.0;
        if (groupRef.current) {
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        }

        // Animación suave del giro sobre sí mismo de 0 a 180 (Math.PI)
        if (modelRotRef.current) {
            const targetRot = isFlipped ? Math.PI : 0;

            // Si no estamos en hover, forzamos la rotación a 0 para quitar el efecto al salir
            if (!hovered) {
                modelRotRef.current.rotation.y = 0;
            } else {
                modelRotRef.current.rotation.y = THREE.MathUtils.lerp(
                    modelRotRef.current.rotation.y,
                    targetRot,
                    0.1 // Velocidad de la animación (menor es más lento)
                );
            }
        }
    });

    // Actualizar posición, orientación y escala cada frame
    useFrame(() => {
        if (!groupRef.current) return;

        const θ    = angleRef.current + offset;
        const cosθ = Math.cos(θ);

        // 1. Posición sobre la elipse fija
        groupRef.current.position.set(
            Math.sin(θ) * RADIUS_X,
            0,
            cosθ       * RADIUS_Z,
        );

        // 2. Orientación: normal exterior de la elipse
        //    tangente = (cos(θ)·Rx, −sin(θ)·Rz)
        //    normal   = (sin(θ)·Rz,  cos(θ)·Rx)
        groupRef.current.rotation.y = Math.atan2(
            Math.sin(θ) * RADIUS_Z,
            cosθ        * RADIUS_X,
        );

        // 3. Zona frontal y escala con lerp suave
        const inFront       = cosθ > FRONT_THRESHOLD;
        isFrontRef.current  = inFront;

        const targetScale   = (isHoveredRef.current && inFront)
            ? SCALE_HOVER
            : inFront
                ? SCALE_FRONT
                : SCALE_DEFAULT;

        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, LERP_SPEED);
        groupRef.current.scale.setScalar(scaleRef.current);
    });

    // Handlers de puntero — solo actúan cuando el modelo está al frente
    const handlePointerEnter = useCallback(() => {
        if (isFrontRef.current) {
            isHoveredRef.current      = true;
            document.body.style.cursor = 'pointer';
        }
    }, []);

    const handlePointerLeave = useCallback(() => {
        isHoveredRef.current      = false;
        document.body.style.cursor = 'default';
    }, []);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        if (isFrontRef.current) {
            onSelect(gameData);
        }
    }, [onSelect, gameData]);

    return (
        <group
            ref={groupRef}
            onClick={handleClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <primitive object={clonedScene} />
        <group
            position={position}
            rotation={[0, yRotation, 0]}
            ref={groupRef}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                setGlobalHover(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false);
                setGlobalHover(false);
                setIsFlipped(false); // Vuelve a su estado normal
                document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
                e.stopPropagation();
                // Alternar el estado volteado
                setIsFlipped((prev) => !prev);
            }}
        >
            <group ref={modelRotRef} rotation={[0, 0, 0]}>
                <primitive object={clonedScene} />
            </group>
        </group>
    );
}

// ─────────────────────────────────────────────────────────
// CarouselRing: administra el ángulo global y distribuye
// cada slot a lo largo de la elipse fija.
//
// Props:
//   isPausedRef – ref: true = pausado
//   onSelect    – callback cuando el usuario elige un juego
// ─────────────────────────────────────────────────────────
function CarouselRing({ isPausedRef, onSelect }) {
    const angleRef = useRef(0);
    const [isHovered, setIsHovered] = useState(false);

    useFrame((_state, delta) => {
        if (!isPausedRef.current) {
            angleRef.current += delta * SPEED;
        }
    });

    const slots = useMemo(() =>
        Array.from({ length: NUM_MODELS }, (_, i) => ({
            offset:   (i / NUM_MODELS) * Math.PI * 2,
            url:      SLOT_URLS[i] ?? spideyUrl,
            gameData: GAME_DATA[i],
        }))
    , []);

    return (
        <>
            {slots.map((slot, i) => (
                <ModelInstance
                    key={i}
                    offset={slot.offset}
                    angleRef={angleRef}
                    isPausedRef={isPausedRef}
                    url={slot.url}
                    gameData={slot.gameData}
                    onSelect={onSelect}
                    setGlobalHover={setIsHovered}
                />
            ))}
        </>
    );
}

// ─────────────────────────────────────────────────────────
// Carousel3D: componente raíz exportado.
// Gestiona el estado del modal y la pausa del carrusel.
// ─────────────────────────────────────────────────────────
function Carousel3D() {
    const [selectedGame, setSelectedGame] = useState(null);

    // Ref (no estado) para no forzar re-render de Canvas al pausar/reanudar
    const isPausedRef = useRef(false);

    const handleSelect = useCallback((gameData) => {
        isPausedRef.current = true;
        document.body.style.cursor = 'default';
        setSelectedGame(gameData);
    }, []);

    const handleClose = useCallback(() => {
        setSelectedGame(null);
        isPausedRef.current = false;
    }, []);

    return (
        <section id="3d-suits" className="three-d-suits-section">
            <div className="container mb-1">
                <h2 className="section-title text-center brutalist-text" data-aos="fade-up">
                    JUEGOS DE CONSOLA
                </h2>
            </div>

            <div style={{ width: '120%', marginLeft: '-10%', height: '560px', overflow: 'hidden' }}>
                <Canvas
                    camera={{ position: [0, 0, 6.5], fov: 90 }}
                    gl={{ antialias: true, alpha: true }}
                    style={{ width: '100%', height: '100%', background: 'transparent' }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
                    <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#0066cc" />
                    <pointLight position={[0, 6, 0]} intensity={1.2} color="#e50914" />
                    <pointLight position={[0, -3, 0]} intensity={0.4} color="#ffffff" />

                    <Suspense fallback={<CanvasLoader />}>
                        <CarouselRing isPausedRef={isPausedRef} onSelect={handleSelect} />
                        <Environment preset="city" />
                        <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={16} blur={2.5} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Pista de uso */}
            <p style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                marginTop: '0.5rem',
            }}>
                Haz clic en los juegos del frente para ver detalles
            </p>

            {/* Modal: se monta solo cuando hay un juego seleccionado */}
            {selectedGame && (
                <GameModal game={selectedGame} onClose={handleClose} />
            )}
        </section>
    );
}

useGLTF.preload(spideyUrl);
useGLTF.preload(moralesUrl);
useGLTF.preload(morales2Url);
useGLTF.preload(morales3Url);
useGLTF.preload(morales4Url);
useGLTF.preload(morales5Url);
useGLTF.preload(morales6Url);

export default Carousel3D;
