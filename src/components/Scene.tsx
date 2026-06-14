"use client";

import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import LiquidForm from "./LiquidForm";
import CameraRig from "./CameraRig";
import GroundMirror from "./GroundMirror";

export default function Scene() {
  return (
    <>
      <color attach="background" args={["#07090d"]} />
      <fog attach="fog" args={["#05060a", 6, 14]} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 6, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.8} color="#0ea374" />
      <pointLight position={[-2, -3, 3]} intensity={1.2} color="#ffb88a" distance={12} />
      <pointLight position={[3, 4, -2]} intensity={0.6} color="#34d399" distance={10} />

      {/* Procedural studio environment, built for a dark cinematic void:
          bright, saturated panels give the chrome surface hard, colorful
          reflections that pop against near-black. */}
      <Environment resolution={512}>
        <group>
          <Lightformer form="rect" intensity={8} color="#ffffff" position={[0, 4, -4]} scale={[9, 9, 1]} />
          <Lightformer form="rect" intensity={4} color="#ffffff" position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[7, 6, 1]} />
          <Lightformer form="rect" intensity={4} color="#ffffff" position={[5, 1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[7, 6, 1]} />
          <Lightformer form="ring" color="#000000" intensity={6} position={[0, -1.5, 5]} scale={6.5} />
          <Lightformer form="ring" color="#000510" intensity={5} position={[0, 2, -3]} scale={5} />
          <Lightformer form="circle" color="#34d399" intensity={3} position={[-3.5, -1.5, 3]} scale={2.6} />
          <Lightformer form="circle" color="#ffb88a" intensity={2} position={[3.5, -2, 2]} scale={1.8} />
          <Lightformer form="circle" color="#0ea374" intensity={1.5} position={[0, 3, 1]} scale={3} />
        </group>
      </Environment>

      <LiquidForm />
      <CameraRig />
      <GroundMirror />

      {/* Ambient drifting dust — gives the otherwise empty space around the
          form some depth and life without competing with it visually. */}
      <Sparkles count={120} scale={[10, 8, 8]} size={1.2} speed={0.08} opacity={0.5} color="#ffffff" />
      <Sparkles count={50} scale={[8, 6, 6]} size={2.5} speed={0.05} opacity={0.3} color="#34d399" />
      <Sparkles count={30} scale={[6, 4, 4]} size={4} speed={0.03} opacity={0.15} color="#0ea374" />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.3} intensity={0.45} />
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
