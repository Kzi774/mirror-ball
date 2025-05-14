import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CubeCamera, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

type CubePosition = [number, number, number];

function ReflectiveSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [cubePositions, setCubePositions] = useState<CubePosition[]>([]);

  // 初期化時に立方体の位置を一度だけ生成
  useEffect(() => {
    const positions: CubePosition[] = [];
    for (let i = 0; i < 6; i++) {
      const randomDistance = Math.random() * 10 + 20;
      const angle = i * Math.PI / 3;
      const x = randomDistance * Math.cos(angle);
      const z = randomDistance * Math.sin(angle);
      const y = Math.random() * 20 - 10;
      positions.push([x, y, z]);
    }
    setCubePositions(positions);
  }, []);

  return (
    <group>
      <CubeCamera resolution={512} frames={Infinity}>
        {(texture) => (
          <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[20, 32, 16]} />
            <meshLambertMaterial
              color={0xffffff}
              envMap={texture}
              reflectivity={0.9}
              combine={THREE.MixOperation}
            />
          </mesh>
        )}
      </CubeCamera>

      {/* 初期化された位置に立方体を表示 */}
      {cubePositions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial
              color={new THREE.Color(Math.random(), Math.random(), Math.random())}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function App() {
  return (
    <div className="canvasWrapper">
      <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 100, 100]} intensity={1} />
        <ReflectiveSphere />
        <Environment files={"/rogland_clear_night_4k.hdr"} background />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
