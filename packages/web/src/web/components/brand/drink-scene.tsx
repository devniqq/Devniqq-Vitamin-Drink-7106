import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { StudioEnvironment, buildCanGeometry, useLabelTexture } from "./can-3d";

// Stylised figure: a person in a hoodie holding a can. Loops every 5 s:
// the can turns in the hand, rises to the mouth, tilts, the head tips back
// for a gulp, then the can goes back down. Units match can-3d.tsx (can ~1.9 tall).

const SHOULDER = new THREE.Vector3(0.5, 0.0, 0.42);
const UPPER_LEN = 0.95;
const FORE_LEN = 0.9;
const REST = new THREE.Vector3(1.0, -0.45, 0);
const DRINK = new THREE.Vector3(1.12, 0.38, 0.15);
const DRINK_TILT = 0.9; // radians, top of the can toward the mouth
const LOOP = 5; // seconds

const SKIN = "#C8906E";
const HOODIE = "#262B5C";
const HAIR = "#1B2050";
const UP = new THREE.Vector3(0, 1, 0);
const ELBOW_REF = new THREE.Vector3(0.5, -1, 0.2).normalize();

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};
const ramp = (p: number, a: number, b: number) => (p - a) / (b - a);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const _u = new THREE.Vector3();
const _side = new THREE.Vector3();

// Two-bone arm: elbow sits on a circle around the shoulder-hand line, pointing down and out.
function solveElbow(shoulder: THREE.Vector3, hand: THREE.Vector3, out: THREE.Vector3) {
  _u.subVectors(hand, shoulder);
  const d = Math.min(_u.length(), UPPER_LEN + FORE_LEN - 0.001);
  _u.normalize();
  const a = (UPPER_LEN * UPPER_LEN - FORE_LEN * FORE_LEN + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, UPPER_LEN * UPPER_LEN - a * a));
  _side.copy(ELBOW_REF).addScaledVector(_u, -ELBOW_REF.dot(_u)).normalize();
  return out.copy(shoulder).addScaledVector(_u, a).addScaledVector(_side, h);
}

// Places a unit-height cylinder so it spans from a to b.
function placeLimb(mesh: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
  mesh.scale.set(1, len, 1);
}

function Figure() {
  const tex = useLabelTexture("Citrus");
  const canGeo = useMemo(buildCanGeometry, []);
  const limbGeo = useMemo(() => new THREE.CylinderGeometry(0.13, 0.13, 1, 20), []);

  const outer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const hand = useRef<THREE.Mesh>(null);
  const upper = useRef<THREE.Mesh>(null);
  const fore = useRef<THREE.Mesh>(null);
  const elbow = useRef<THREE.Mesh>(null);

  const center = useMemo(() => new THREE.Vector3(), []);
  const handPos = useMemo(() => new THREE.Vector3(), []);
  const elbowPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = (t % LOOP) / LOOP;

    const lift = smooth(ramp(p, 0.18, 0.42));
    const down = smooth(ramp(p, 0.6, 0.84));
    const w = clamp01(lift - down); // 0 = rest, 1 = at the mouth
    const gulp = Math.sin(Math.PI * clamp01(ramp(p, 0.42, 0.6)));

    center.lerpVectors(REST, DRINK, w);
    const o = outer.current;
    const ti = tilt.current;
    const hd = head.current;
    if (!o || !ti || !hd || !hand.current) return;

    // Label faces the camera at PI. While at rest the can turns on its axis.
    o.position.copy(center);
    o.rotation.set(0, Math.PI + t * 0.6 * (1 - w), 0);
    ti.rotation.set(0, 0, DRINK_TILT * w + 0.15 * gulp * w);
    hd.rotation.set(0, 0, 0.22 * gulp * w);

    o.updateMatrixWorld(true);
    hand.current.getWorldPosition(handPos);

    solveElbow(SHOULDER, handPos, elbowPos);
    if (upper.current) placeLimb(upper.current, SHOULDER, elbowPos);
    if (fore.current) placeLimb(fore.current, elbowPos, handPos);
    if (elbow.current) elbow.current.position.copy(elbowPos);
  });

  return (
    <>
      {/* Torso */}
      <mesh position={[0, -0.9, 0]}>
        <capsuleGeometry args={[0.75, 1.0, 12, 24]} />
        <meshStandardMaterial color={HOODIE} roughness={0.75} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.02, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.5, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>

      {/* Head, faces +x toward the can */}
      <group ref={head} position={[0, 0.75, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 48, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <sphereGeometry args={[0.53, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={HAIR} roughness={0.5} />
        </mesh>
        <mesh position={[0.5, -0.04, 0]}>
          <sphereGeometry args={[0.07, 20, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.6} />
        </mesh>
        <mesh position={[0.36, 0.1, 0.2]} scale={[0.6, 1, 1]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshStandardMaterial color="#14120f" />
        </mesh>
      </group>

      {/* Arm: upper arm, elbow, forearm */}
      <mesh ref={upper} geometry={limbGeo}>
        <meshStandardMaterial color={HOODIE} roughness={0.75} />
      </mesh>
      <mesh ref={elbow}>
        <sphereGeometry args={[0.13, 20, 16]} />
        <meshStandardMaterial color={HOODIE} roughness={0.75} />
      </mesh>
      <mesh ref={fore} geometry={limbGeo}>
        <meshStandardMaterial color={HOODIE} roughness={0.75} />
      </mesh>

      {/* Can and hand */}
      <group ref={outer}>
        <group ref={tilt}>
          <mesh geometry={canGeo} castShadow>
            <meshPhysicalMaterial map={tex} metalness={0.9} roughness={0.3} clearcoat={0.5} clearcoatRoughness={0.18} envMapIntensity={1.1} />
          </mesh>
          <mesh ref={hand} position={[0.45, -0.05, -0.2]} scale={[0.8, 1.1, 0.85]}>
            <sphereGeometry args={[0.17, 24, 16]} />
            <meshStandardMaterial color={SKIN} roughness={0.6} />
          </mesh>
        </group>
      </group>
    </>
  );
}

export function DrinkScene() {
  return (
    <Canvas
      camera={{ position: [0.35, -0.35, 10], fov: 30 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ background: "transparent" }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#dfe8ff" />
      <Figure />
      <ContactShadows position={[0.2, -2.15, 0]} opacity={0.4} scale={5} blur={2.5} far={2} />
    </Canvas>
  );
}
