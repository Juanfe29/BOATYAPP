'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 5000 }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            meshRef.current?.setMatrixAt(i, dummy.matrix);
        });
        if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
        </instancedMesh>
    );
};

export default function AntigravityScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ParticleField />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Environment preset="night" />
            </Canvas>
        </div>
    );
}
