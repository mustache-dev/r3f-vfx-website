import { Canvas } from "@react-three/fiber";
import { VFXParticles } from "r3f-vfx";
import { Environment } from "@react-three/drei";

const Scene = () => {
  return (
    <>
      <VFXParticles
        emitterShape={2}
        emitterRadius={3}
        size={[0.01, 0.04]}
        speed={[0.1, 0.3]}
        lifetime={[3, 5]}
        colorStart={["#e056ff", "#b044cc", "#7b2d99"]}
        colorEnd={["#e056ff00"]}
        fadeOpacity={[1, 0]}
        // blending={"additive"}
        emitCount={10}
        attractors={[
          {
            position: [0, 0, 0],
            strength: 2,
            radius: 4,
            type: 0,
          },
        ]}
      />
      <Environment preset="sunset" />
    </>
  );
};

export const AttractorsScene = () => {
  return (
    <div className="scene-canvas">
      <Canvas renderer={{ forceWebGL: false }}>
        <Scene />
      </Canvas>
    </div>
  );
};
