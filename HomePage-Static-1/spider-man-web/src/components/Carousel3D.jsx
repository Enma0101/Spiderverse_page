import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import spideyUrl from '../assets/Untitled.glb?url';
import moralesUrl from '../assets/Morales.glb?url';
import morales2Url from '../assets/Morales2.glb?url';
import morales3Url from '../assets/Morales3.glb?url';
import morales4Url from '../assets/Morales4.glb?url';
import morales5Url from '../assets/Morales5.glb?url';
import morales6Url from '../assets/Morales6.glb?url';

const NUM_MODELS = 7;
const RADIUS = 5;

/**
 * Config per model type.
 * xRot/yRot: Euler radians applied to the primitive (local space).
 * The MODEL is centered & scaled inside useMemo — rotation is applied
 * to the clone so the bounding-box re-center is AFTER the fix.
 */
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
    3: morales4Url,
    4: morales2Url,
    5: morales5Url,
    6: morales6Url,
};

function ModelInstance({ position, yRotation, url }) {
    const { scene } = useGLTF(url);
    const { xRot, yRot, zRot } = MODEL_CFG[url] ?? MODEL_CFG[spideyUrl];

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);

        // 1. Aplicar la rotación de corrección AL CLON (antes de medir el bbox)
        clone.rotation.set(xRot, yRot, zRot);
        clone.updateMatrixWorld(true);

        // 2. Escalar al tamaño objetivo
        const box1 = new THREE.Box3().setFromObject(clone);
        const size = new THREE.Vector3();
        box1.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.6 / maxDim;
        clone.scale.setScalar(scale);
        clone.updateMatrixWorld(true);

        // 3. Centrar en el origen DESPUÉS de escalar y rotar
        const box2 = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        clone.position.sub(center);

        return clone;
    }, [scene, xRot, yRot, zRot]);

    // El group solo maneja posición + orientación radial del anillo
    return (
        <group position={position} rotation={[0, yRotation, 0]}>
            <primitive object={clonedScene} />
        </group>
    );
}

function CarouselRing() {
    const groupRef = useRef();

    useFrame((_state, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
    });

    const slots = useMemo(() =>
        Array.from({ length: NUM_MODELS }, (_, i) => {
            const angle = (i / NUM_MODELS) * Math.PI * 2;
            return {
                position: [Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS],
                yRotation: angle,
                url: SLOT_URLS[i] ?? spideyUrl,
            };
        })
        , []);

    return (
        <group ref={groupRef}>
            {slots.map((slot, i) => (
                <ModelInstance
                    key={i}
                    position={slot.position}
                    yRotation={slot.yRotation}
                    url={slot.url}
                />
            ))}
        </group>
    );
}

const Carousel3D = () => (
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

                <Suspense fallback={null}>
                    <CarouselRing />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={16} blur={2.5} />
                </Suspense>
            </Canvas>
        </div>
    </section>
);

useGLTF.preload(spideyUrl);
useGLTF.preload(moralesUrl);
useGLTF.preload(morales2Url);
useGLTF.preload(morales3Url);
useGLTF.preload(morales4Url);
useGLTF.preload(morales5Url);
useGLTF.preload(morales6Url);

export default Carousel3D;
