import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Brand colors on the label
const INK = "#14183F";
const ORANGE = "#F26B1D";
const SILVER = "#C9CED6";

// Proportions of a standard 330 ml can: height about 1.9x the diameter.
const RADIUS = 0.5;
const HALF_H = 0.95;

// Reflections for metal: a neutral studio environment, generated locally.
export function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

// Full 360° label, unwrapped. u runs around the can, v runs bottom to top.
// Text sits at u = 0.5 so the lathe mesh is rotated by PI to face the camera.
export function useLabelTexture(flavor: string) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    document.fonts
      .load("800 200px Manrope")
      .then(() => !cancelled && setVersion((v) => v + 1))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const W = 2048;
    const H = 1024;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d")!;

    // Brushed aluminium base
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#e4e8ee");
    grad.addColorStop(0.5, "#c5cbd4");
    grad.addColorStop(1, "#e4e8ee");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 2) {
      g.fillStyle = `rgba(255,255,255,${((y * 37) % 11) / 200})`;
      g.fillRect(0, y, W, 1);
    }

    // Ink band between v 0.28 and 0.72 (canvas y is flipped)
    const top = Math.round(H * 0.28);
    const bottom = Math.round(H * 0.72);
    g.fillStyle = INK;
    g.fillRect(0, top, W, bottom - top);
    g.fillStyle = ORANGE;
    g.fillRect(0, bottom, W, 12);

    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#FFFFFF";
    g.font = "800 190px Manrope, sans-serif";
    g.fillText("devniqq", W / 2, top + 150);

    g.fillStyle = SILVER;
    g.font = "700 58px Manrope, sans-serif";
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "14px";
    g.fillText(flavor.toUpperCase(), W / 2, top + 300);
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";

    g.fillStyle = "#8c95ab";
    g.font = "600 30px Manrope, sans-serif";
    g.fillText("DAILY VITAMIN DRINK  ·  330 ML", W / 2, bottom - 60);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
    // version forces a redraw once the font is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flavor, version]);
}

// Lathe profile of the can: flat base, straight wall, necked top, rolled rim.
const PROFILE: [number, number][] = [
  [0, -HALF_H],
  [0.36, -HALF_H],
  [0.42, -0.93],
  [0.47, -0.88],
  [RADIUS, -0.78],
  [RADIUS, 0.5],
  [0.49, 0.6],
  [0.46, 0.7],
  [0.42, 0.8],
  [0.405, 0.87],
  [0.41, 0.93],
  [0.42, HALF_H],
  [0, HALF_H],
];

export function buildCanGeometry() {
  const pts = PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, 160);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  // Map v from bottom (0) to top (1) of the can, so the label band lands on the wall.
  for (let i = 0; i < pos.count; i++) {
    uv.setY(i, (pos.getY(i) + HALF_H) / (2 * HALF_H));
  }
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function CanModel({ flavor, spin, scrollSpin }: { flavor: string; spin: boolean; scrollSpin: boolean }) {
  const tex = useLabelTexture(flavor);
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(buildCanGeometry, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Text faces the camera at PI. Slow turn, plus scroll-linked turn on the hero.
    const turn = (spin ? t * 0.45 : 0) + (scrollSpin && typeof window !== "undefined" ? window.scrollY * 0.003 : 0);
    g.rotation.y = Math.PI + turn;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.12, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, state.pointer.x * 0.04, 0.05);
    g.position.y = Math.sin(t * 1.3) * 0.03;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial map={tex} metalness={0.9} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.18} envMapIntensity={1.1} />
      </mesh>
    </group>
  );
}

export function Can3D({
  flavor,
  spin = true,
  shadow = true,
  camera = 5.2,
  scrollSpin = false,
}: {
  flavor: string;
  spin?: boolean;
  shadow?: boolean;
  camera?: number;
  scrollSpin?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.25, camera], fov: 28 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ background: "transparent" }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#dfe8ff" />
      <CanModel flavor={flavor} spin={spin} scrollSpin={scrollSpin} />
      {shadow && <ContactShadows position={[0, -1.05, 0]} opacity={0.45} scale={4} blur={2.6} far={2} />}
    </Canvas>
  );
}
