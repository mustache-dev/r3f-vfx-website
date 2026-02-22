import { VFXParticles } from "r3f-vfx";
import { FeatureCanvas } from "../FeatureCanvas";

export const EmitterShapesScene = () => {
  return (
    <FeatureCanvas>
      <VFXParticles
        emitterShape={2}
        emitterRadius={1.5}
        size={[0.02, 0.08]}
        speed={[0.2, 0.6]}
        lifetime={[1.5, 3]}
        colorStart={["#ff6b35", "#ff8f65", "#ffd4a0"]}
        colorEnd={["#ff6b3500"]}
        fadeOpacity={[1, 0]}
        fadeSize={[1, 0.2]}
        emitCount={8}
        gravity={[0, 0.1, 0]}
      />
    </FeatureCanvas>
  );
};
