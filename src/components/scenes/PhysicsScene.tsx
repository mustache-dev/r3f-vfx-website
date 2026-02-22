import { VFXParticles } from "r3f-vfx";
import { FeatureCanvas } from "../FeatureCanvas";

export const PhysicsScene = () => {
  return (
    <FeatureCanvas>
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
        emitCount={5}
      />
    </FeatureCanvas>
  );
};
