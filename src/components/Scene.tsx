"use client";

import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import LiquidForm from "./LiquidForm";
import CameraRig from "./CameraRig";

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#fbfbfc"]} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.35} color="#cfe3ff" />
      <pointLight position={[-2, -3, 3]} intensity={0.6} color="#ffb88a" distance={12} />

      {/* Procedural studio environment: bright panels + a dark ring give the
          chrome surface the light/dark contrast it needs to read as liquid
          metal against a white page. A faint mint panel echoes the brand
          accent in the reflections. */}
      <Environment resolution={256}>
        <group>
          <Lightformer form="rect" intensity={3.5} color="#ffffff" position={[0, 4, -4]} scale={[9, 9, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[7, 6, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[5, 1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[7, 6, 1]} />
          <Lightformer form="ring" color="#0c0e12" intensity={3.2} position={[0, -1.5, 5]} scale={6.5} />
          <Lightformer form="ring" color="#10141c" intensity={2.6} position={[0, 2, -3]} scale={5} />
          <Lightformer form="circle" color="#34d399" intensity={1.4} position={[-3.5, -1.5, 3]} scale={2.6} />
          <Lightformer form="circle" color="#ffb88a" intensity={1} position={[3.5, -2, 2]} scale={1.8} />
        </group>
      </Environment>

      <LiquidForm />
      <CameraRig />

      {/* Ambient drifting dust — gives the otherwise empty space around the
          form some depth and life without competing with it visually. */}
      <Sparkles count={60} scale={[8, 6, 6]} size={1.5} speed={0.15} opacity={0.35} color="#ffffff" />
      <Sparkles count={30} scale={[6, 5, 5]} size={3} speed={0.1} opacity={0.2} color="#34d399" />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.94} luminanceSmoothing={0.2} intensity={0.3} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0004, 0.0006)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}
