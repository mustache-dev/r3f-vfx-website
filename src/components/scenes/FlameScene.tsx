import { useLoader } from "@react-three/fiber/webgpu";
import { VFXParticles } from "r3f-vfx";
import { SphereGeometry, SRGBColorSpace, TextureLoader } from "three";
import { color, mix, texture, vec3, vec4 } from "three/tsl";
import { FeatureCanvas } from "../FeatureCanvas";

/**
 * Two-layer flame effect inspired by the flame repo's FlameVFX.
 * Layer 1: Main flame with fire texture alpha and color fade.
 * Layer 2: Glowing core with sphere geometry, turbulence, and stretch.
 */
export const FlameScene = () => {
  return (
    <FeatureCanvas>
      <FlameEffect />
    </FeatureCanvas>
  );
};

function FlameEffect() {
  const tex = useLoader(TextureLoader, "/fire.png");
  tex.colorSpace = SRGBColorSpace;

  const colorNode = (progress: any) => {
    const t = texture(tex);
    const col = color("#ff7b00").mul(8);
    const finalCol = mix(col, vec3(0), progress.smoothstep(0, 0.5));
    return vec4(
      finalCol,
      t.a.pow(3).mul(progress.oneMinus().smoothstep(0, 0.5)),
    );
  };

  return (
    <>
      {/* Layer 1: Main flame — texture-based alpha with color fade */}
      <VFXParticles
        fadeSize={[0.8, 1]}
        fadeOpacity={[1, 1]}
        gravity={[0, 1.2, 0]}
        speed={[0.1, 0.31]}
        rotation={[
          [0, 0],
          [-6.3, 6.2],
          [0, 0],
        ]}
        appearance="gradient"
        lighting="standard"
        emitterShape={1}
        colorNode={({ progress }) => colorNode(progress)}
      />

      {/* Layer 2: Glowing core — sphere geometry, turbulence, stretch */}
      <VFXParticles
        geometry={new SphereGeometry(0.5, 16, 12)}
        colorNode={color("#ff7b00").mul(8)}
        delay={0.05}
        size={[0.001, 0.02]}
        gravity={[0, 1.1, 0]}
        speed={[0.1, 0.48]}
        appearance="gradient"
        lifetime={[0.3, 3]}
        blending={2}
        lighting="basic"
        emitterShape={2}
        emitterRadius={[0, 0.2]}
        turbulence={{
          intensity: 0.43,
          frequency: 0.49,
          speed: 0.92,
        }}
        stretchBySpeed={{
          factor: 3,
          maxStretch: 10,
        }}
      />

      <pointLight intensity={3} color="#ff7b00" position={[0, 0, 0]} />
    </>
  );
}
