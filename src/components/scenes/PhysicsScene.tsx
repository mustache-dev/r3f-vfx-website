import { Canvas } from "@react-three/fiber";
import { VFXParticles } from "r3f-vfx";
import { Environment } from "@react-three/drei";

const Scene = () => {
  return (
    <>
      <VFXParticles
        emitterShape={3}
        emitterRadius={0.3}
        emitterAngle={0.4}
        size={[0.03, 0.06]}
        speed={[1, 2]}
        lifetime={[2, 4]}
        colorStart={["#4ecdc4", "#44a8b3", "#2d8f9a"]}
        colorEnd={["#4ecdc400"]}
        gravity={[0, -1, 0]}
        turbulence={{ intensity: 0.5, frequency: 1.2, speed: 0.8 }}
        fadeOpacity={[1, 0]}
        fadeSize={[0.5, 1]}
        // blending={"additive"}
        emitCount={5}
        // collision={{ plane: -2, bounce: 0.4, friction: 0.2 }}
      />
      <Environment preset="night" />
    </>
  );
};

export const PhysicsScene = () => {
  return (
    <div className="scene-canvas">
      <Canvas renderer={{ forceWebGL: false }}>
        <Scene />
      </Canvas>
    </div>
  );
};
