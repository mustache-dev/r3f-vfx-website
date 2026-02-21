import { Canvas } from "@react-three/fiber";
import { VFXParticles } from "r3f-vfx";
import { Environment } from "@react-three/drei";

const Scene = () => {
  return (
    <>
      <VFXParticles
        emitterShape={4}
        emitterRadius={2}
        size={[0.02, 0.06]}
        speed={[0.05, 0.15]}
        lifetime={[2, 4]}
        colorStart={["#ff6b35", "#e056ff", "#4ecdc4"]}
        colorEnd={["#ffffff00"]}
        fadeOpacity={[1, 0]}
        fadeSize={[1, 0]}
        // blending={"additive"}
        emitCount={12}
        turbulence={{ intensity: 0.8, frequency: 0.6, speed: 0.4 }}
        gravity={[0, 0.3, 0]}
        appearance={"circular"}
      />
      <Environment preset="dawn" />
    </>
  );
};

export const CustomShadersScene = () => {
  return (
    <div className="scene-canvas">
      <Canvas renderer={{ forceWebGL: false }}>
        <Scene />
      </Canvas>
    </div>
  );
};
