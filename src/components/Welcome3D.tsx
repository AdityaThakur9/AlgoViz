import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Welcome3DProps {
  onEnter: () => void;
}

const Welcome3D: React.FC<Welcome3DProps> = ({ onEnter }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x181818, 1);
    mountRef.current?.appendChild(renderer.domElement);

    // Glowing torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.6, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x00eaff,
      emissive: 0x2196f3,
      emissiveIntensity: 0.7,
      metalness: 0.7,
      roughness: 0.2,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 120;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00eaff, 1.2);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // Animation loop
    let frameId: number;
    const animate = () => {
      torus.rotation.x += 0.012;
      torus.rotation.y += 0.018;
      particles.rotation.y += 0.002;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Handle fade-out transition
  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      onEnter();
    }, 700); // match transition duration
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'rgba(24,24,24,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1)',
      }}
    >
      <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }} />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '3rem',
          fontWeight: 900,
          marginBottom: '2.5rem',
          textAlign: 'center',
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, #00eaff 0%, #2196f3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 32px #00eaff, 0 2px 8px #2196f3',
          filter: 'drop-shadow(0 0 8px #00eaff)',
          animation: 'fadeInText 1.2s cubic-bezier(.4,0,.2,1)',
        }}
      >
        Welcome to <br />AlgoViz
      </div>
      <button
        onClick={handleEnter}
        style={{
          zIndex: 2,
          padding: '1.1rem 2.7rem',
          fontSize: '1.35rem',
          background: 'linear-gradient(90deg, #2196f3 0%, #00eaff 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 700,
          boxShadow: '0 2px 24px #00eaff',
          transition: 'background 0.2s, transform 0.2s',
          marginTop: '1.5rem',
        }}
      >
        Enter AlgoViz
      </button>
      <style>{`
        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Welcome3D; 