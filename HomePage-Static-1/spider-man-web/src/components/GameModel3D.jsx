import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import modelUrl from '../assets/Untitled.glb?url';

function SpiderModel() {
    const { scene } = useGLTF(modelUrl);

    useEffect(() => {
        if (!scene) return;

        // Corregir orientación Blender Z-up → Y-up
        scene.rotation.set(-Math.PI / 2, 0, 0);
        scene.updateMatrixWorld(true);

        // Calcular bounding box y escalar
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        scene.scale.setScalar(scale);
        scene.updateMatrixWorld(true);

        // Centrar
        const box2 = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        scene.position.set(-center.x, -center.y, -center.z);
    }, [scene]);

    return <primitive object={scene} />;
}

const GameModel3D = () => (
    <Canvas
        // Cámara levemente inclinada para dar sensación de profundidad 3D
        camera={{ position: [1.2, 1.0, 3.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
        {/* Iluminación dramática para resaltar el volumen del modelo */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
        <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#3399ff" />
        <pointLight position={[2, 4, 3]} intensity={1.5} color="#ff4422" />
        <pointLight position={[-2, -2, 2]} intensity={0.6} color="#ffffff" />

        <Suspense fallback={null}>
            <SpiderModel />
        </Suspense>
    </Canvas>
);

export default GameModel3D;
