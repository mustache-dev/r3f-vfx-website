import { VFXParticles } from "r3f-vfx";
import { FeatureCanvas } from "../FeatureCanvas";

export const AttractorsScene = () => {
  return (
    <FeatureCanvas>
      <VFXParticles
        emitterShape={2}
        emitterRadius={3}
        size={[0.01, 0.04]}
        speed={[0.1, 0.3]}
        lifetime={[3, 5]}
        colorStart={["#e056ff", "#b044cc", "#7b2d99"]}
        colorEnd={["#e056ff00"]}
        fadeOpacity={[1, 0]}
        emitCount={10}
        attractors={[
          {
            position: [0, 0, 0],
            strength: 2,
            radius: 4,
            type: "point",
          },
        ]}
      />
    </FeatureCanvas>
  );
};
