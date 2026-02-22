import { useLoader } from "@react-three/fiber/webgpu";
import { VFXParticles } from "r3f-vfx";
import { NearestFilter, SRGBColorSpace, TextureLoader } from "three";
import { color, mix, texture, vec3, vec4 } from "three/tsl";
import { FeatureCanvas } from "../FeatureCanvas";

/**
 * Flipbook / sprite sheet demo.
 * Uses a fire.png texture as an alpha map with colorNode to create
 * animated fire sprites that fade from bright orange to dark over lifetime.
 */
export const FlipbookScene = () => {
  return (
    <FeatureCanvas>
      <FlipbookEffect />
    </FeatureCanvas>
  );
};

function FlipbookEffect() {
  const tex = useLoader(TextureLoader, "/fire.png");
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = NearestFilter;
  tex.magFilter = NearestFilter;

  const fireColor = color("#fb8d2b").mul(30);

  return (
    <>
      {/* Fire sprites with texture-driven alpha and emissive color */}
      <VFXParticles
        emitterShape={2}
        emitterRadius={[0, 0.5]}
        emitCount={6}
        size={[0.3, 0.8]}
        fadeSize={[0.6, 1]}
        speed={[0.1, 0.5]}
        lifetime={[1, 2.5]}
        gravity={[0, 0.8, 0]}
        rotation={[
          [0, 0],
          [-6.3, 6.3],
          [0, 0],
        ]}
        appearance="gradient"
        lighting="standard"
        blending={2}
        colorNode={({ progress }) =>
          vec4(
            mix(
              fireColor,
              color("#ff2200").mul(5),
              progress.smoothstep(0.3, 0.8),
            ),
            texture(tex).a.pow(2).mul(progress.oneMinus().smoothstep(0, 0.6)),
          )
        }
      />

      {/* Ember particles rising from the fire */}
      <VFXParticles
        emitterShape={2}
        emitterRadius={[0, 0.3]}
        emitCount={3}
        size={[0.01, 0.04]}
        speed={[0.5, 1.5]}
        lifetime={[2, 4]}
        gravity={[0, 0.5, 0]}
        intensity={20}
        colorStart={["#ff6b35", "#fb8d2b"]}
        colorEnd={["#ff6b3500"]}
        fadeOpacity={[1, 0]}
        appearance="gradient"
        turbulence={{
          intensity: 0.3,
          frequency: 1,
          speed: 0.5,
        }}
      />

      <pointLight intensity={4} color="#ff7b00" position={[0, 0.5, 0]} />
    </>
  );
}
