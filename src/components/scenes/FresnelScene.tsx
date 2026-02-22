import { VFXParticles } from "r3f-vfx";
import { SphereGeometry } from "three";
import {
  dot,
  Fn,
  mix,
  normalView,
  positionViewDirection,
  pow,
  vec3,
} from "three/tsl";
import { FeatureCanvas } from "../FeatureCanvas";

/**
 * Fresnel / backdrop shader demo inspired by flame repo's SlashVFX2.
 * Uses custom geometry (sphere) with a fresnel-based colorNode to create
 * glowing rim-lit particles with extreme stretch.
 */
export const FresnelScene = () => {
  return (
    <FeatureCanvas>
      <FresnelEffect />
    </FeatureCanvas>
  );
};

function FresnelEffect() {
  return (
    <>
      {/* Fresnel rim-lit spheres with extreme stretch */}
      <VFXParticles
        emitCount={3}
        geometry={new SphereGeometry(0.3, 16, 12)}
        size={0.1}
        direction={[
          [-1, 1],
          [-1, 1],
          [-1, 1],
        ]}
        startPosition={[
          [-3, 3],
          [0.5, 1.5],
          [-3, 3],
        ]}
        lifetime={0.3}
        fadeSize={[0.7, 1]}
        speed={0.001}
        orientToDirection={true}
        colorStart={["#000000"]}
        intensity={2}
        stretchBySpeed={{
          factor: 200000,
          maxStretch: 1000000,
        }}
        appearance="gradient"
        lighting="basic"
        emitterShape={1}
        colorNode={Fn(() => {
          const fresnel = pow(
            dot(normalView, positionViewDirection).oneMinus(),
            8,
          );
          return mix(vec3(2), vec3(0), fresnel);
        })}
      />

      {/* Ambient floating particles with softer fresnel */}
      <VFXParticles
        emitCount={5}
        geometry={new SphereGeometry(0.2, 12, 8)}
        size={[0.05, 0.15]}
        speed={[0.2, 0.6]}
        lifetime={[2, 4]}
        emitterShape={2}
        emitterRadius={2}
        fadeOpacity={[1, 0]}
        appearance="gradient"
        lighting="standard"
        colorNode={Fn(() => {
          const fresnel = pow(
            dot(normalView, positionViewDirection).oneMinus(),
            3,
          );
          return mix(vec3(0.1, 0.05, 0.2), vec3(0.5, 0.2, 1).mul(5), fresnel);
        })}
      />
    </>
  );
}
