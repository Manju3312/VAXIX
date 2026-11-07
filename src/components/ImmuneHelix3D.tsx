'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ImmuneHelix3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 480;
    const height = currentMount.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const helixGroup = new THREE.Group();
    scene.add(helixGroup);

    const particleCount = 180;
    const radius = 5.5;
    const length = 26;
    const turns = 3.5;

    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const strand1Mat = new THREE.MeshBasicMaterial({ color: 0xD4AF37 });
    const strand2Mat = new THREE.MeshBasicMaterial({ color: 0x0B0B0C });
    const bridgeMat = new THREE.LineBasicMaterial({ color: 0xF3E5AB, transparent: true, opacity: 0.35 });

    const createdGeometries: THREE.BufferGeometry[] = [sphereGeo];
    const createdLines: THREE.Line[] = [];

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 2 * turns;
      const y = (i / particleCount) * length - length / 2;

      const p1 = new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius);
      const m1 = new THREE.Mesh(sphereGeo, strand1Mat);
      m1.position.copy(p1);
      helixGroup.add(m1);

      const p2 = new THREE.Vector3(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius);
      const m2 = new THREE.Mesh(sphereGeo, strand2Mat);
      m2.position.copy(p2);
      helixGroup.add(m2);

      if (i % 4 === 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        createdGeometries.push(lineGeo);
        const line = new THREE.Line(lineGeo, bridgeMat);
        createdLines.push(line);
        helixGroup.add(line);
      }
    }

    helixGroup.rotation.z = Math.PI / 6;

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(currentTime);
      helixGroup.rotation.y += 0.007;
      helixGroup.rotation.x = mouseY * 0.4;
      helixGroup.rotation.y += mouseX * 0.02;
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      timer.dispose();
      createdGeometries.forEach((g) => g.dispose());
      strand1Mat.dispose();
      strand2Mat.dispose();
      bridgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[460px] pointer-events-none" />;
}
