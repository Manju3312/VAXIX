'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ImmuneHelix3DProps {
  interactive?: boolean;
}

export default function ImmuneHelix3D({ interactive = true }: ImmuneHelix3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNodesCount, setActiveNodesCount] = useState<number>(240);
  const [isRotatingFast, setIsRotatingFast] = useState<boolean>(false);
  const speedRef = useRef(1);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 500;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 28);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // GROUP FOR ENTIRE DNA COMPLEX
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // PARTICLES / NODES SETUP
    const particlesCount = 260;
    setActiveNodesCount(particlesCount);

    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    const goldColor = new THREE.Color('#D4AF37');
    const champagneColor = new THREE.Color('#F3E5AB');
    const amberColor = new THREE.Color('#997D25');

    const totalHeight = 22;
    const radius = 4.2;

    // Store node positions to draw connector base pairs
    const strand1Points: THREE.Vector3[] = [];
    const strand2Points: THREE.Vector3[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const progress = i / particlesCount;
      const t = progress * Math.PI * 9; // turns
      const strand = i % 2 === 0 ? 1 : -1;
      const y = (progress - 0.5) * totalHeight;
      const x = Math.cos(t) * radius * strand;
      const z = Math.sin(t) * radius * strand;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation
      let chosenColor = strand === 1 ? goldColor : champagneColor;
      if (i % 7 === 0) chosenColor = amberColor;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      sizes[i] = strand === 1 ? 0.38 : 0.32;

      if (strand === 1) {
        strand1Points.push(new THREE.Vector3(x, y, z));
      } else {
        strand2Points.push(new THREE.Vector3(x, y, z));
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Canvas Texture for Glowing Circular Particle
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(243, 229, 171, 0.9)');
      gradient.addColorStop(0.7, 'rgba(212, 175, 55, 0.4)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    dnaGroup.add(pointCloud);

    // CONNECTOR BONDS (Base pairs connecting the two strands)
    const linePositions: number[] = [];
    const minLength = Math.min(strand1Points.length, strand2Points.length);

    for (let i = 0; i < minLength; i += 2) {
      const p1 = strand1Points[i];
      const p2 = strand2Points[i];
      if (p1 && p2) {
        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(p2.x, p2.y, p2.z);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    dnaGroup.add(lines);

    // AMBIENT GLOW SPHERE HALO
    const haloGeo = new THREE.SphereGeometry(11, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    dnaGroup.add(halo);

    // MOUSE TRACKING & PARALLAX PHYSICS
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = mouseX * 0.75;
      targetRotationX = 0.15 - mouseY * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = ((currentTime || performance.now()) - startTime) * 0.001;
      const currentSpeed = speedRef.current;

      // Base rotation
      dnaGroup.rotation.y += 0.007 * currentSpeed;
      dnaGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.08;

      // Smooth mouse damping
      dnaGroup.rotation.y += (targetRotationY - dnaGroup.rotation.y) * 0.03;
      dnaGroup.rotation.x += (targetRotationX - dnaGroup.rotation.x) * 0.03;

      // Gentle floating pulse
      dnaGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.45;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [interactive]);

  const toggleSpeed = () => {
    if (speedRef.current === 1) {
      speedRef.current = 2.8;
      setIsRotatingFast(true);
    } else {
      speedRef.current = 1;
      setIsRotatingFast(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center">
      {/* Three.js Container */}
      <div ref={mountRef} className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Telemetry Badge */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-6 flex items-center justify-between sm:justify-start gap-4 p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#D4AF37]/30 shadow-lg text-[11px] font-mono text-[#0B0B0C]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-bold text-[#0B0B0C]">MESH ACTIVE</span>
        </div>
        <div className="h-3 w-[1px] bg-[#D4AF37]/30 hidden sm:block" />
        <span className="text-[#6E6E73] hidden sm:inline">
          Nodes: <strong className="text-[#997D25]">{activeNodesCount} Antibodies</strong>
        </span>
        <div className="h-3 w-[1px] bg-[#D4AF37]/30" />
        <button
          onClick={toggleSpeed}
          className="px-2.5 py-1 rounded-md bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#997D25] font-semibold transition-colors"
          title="Toggle rotation acceleration"
        >
          {isRotatingFast ? '⚡ 2.8x Speed' : '▶ 1.0x Resonance'}
        </button>
      </div>

      {/* Top right indicator */}
      <div className="absolute top-4 right-6 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0B0C]/5 border border-[#D4AF37]/20 text-[10px] font-mono text-[#997D25] uppercase tracking-wider">
        <span>3D Double-Helix Mesh</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <span>Sub-ms eBPF</span>
      </div>
    </div>
  );
}

