import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MeshBasicNodeMaterial,
  NearestFilter,
  PlaneGeometry,
  TextureLoader,
  Vector3,
  type Mesh,
} from "three/webgpu";
import { Floor } from "../floor";
import { VFXParticles, useVFXEmitter } from "r3f-vfx";
import {
  color,
  dot,
  mix,
  normalView,
  normalWorld,
  screenUV,
  texture,
  uniform,
  vec4,
  viewportSharedTexture,
} from "three/tsl";
import { useLoader } from "@react-three/fiber/webgpu";

const SPARK_COUNT_MIN = 3;
const SPARK_COUNT_MAX = 12;
const GRAVITY = -9.8;
const UP_SPEED_MIN = 0.1;
const UP_SPEED_MAX = 10;
const SIDE_SPEED = 8;
const EMIT_DURATION_MIN = 0.2;
const EMIT_DURATION_MAX = 0.8;
const RESET_DURATION = 2;
const SUBSTEPS = 6;
const SPREAD = 0.3;
const SHOCKWAVE_SPEED = 10;
const SHOCKWAVE_DURATION = 0.4;

const _lerpPos = new Vector3();
const _dir = new Vector3();

const shockwaveState = { progress: 1 };

function Shockwave() {
  const meshRef = useRef<Mesh>(null);
  const distortionStrength = useMemo(() => uniform(0), []);

  const material = useMemo(() => {
    const m = new MeshBasicNodeMaterial();
    const fresnel = dot(normalView, normalWorld);
    m.backdropNode = viewportSharedTexture(
      screenUV.add(fresnel.mul(distortionStrength)),
    );
    m.transparent = true;
    return m;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const p = shockwaveState.progress;

    if (p < 1) {
      shockwaveState.progress = Math.min(1, p + delta / SHOCKWAVE_DURATION);
      const t = shockwaveState.progress;
      // Ease out cubic for smooth fade
      const ease = 1 - t;
      const eased = ease * ease * ease;
      const scale = t * SHOCKWAVE_SPEED;
      meshRef.current.scale.set(scale, scale, scale);
      distortionStrength.value = eased * 0.12;
      meshRef.current.visible = true;
    } else {
      meshRef.current.visible = false;
    }
  });

  return (
    <mesh
      ref={meshRef}
      material={material}
      position={[2, -0.5, 0]}
      visible={false}
      renderOrder={999}
    >
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}

function Sparks() {
  const { emit } = useVFXEmitter("sparks");
  const { emit: emit2 } = useVFXEmitter("explosion");

  const t = useRef(0);
  const sparkCount = useRef(SPARK_COUNT_MIN);

  const vectors = useRef(
    Array(SPARK_COUNT_MAX)
      .fill(null)
      .map(() => new Vector3()),
  );
  const prevVectors = useRef(
    Array(SPARK_COUNT_MAX)
      .fill(null)
      .map(() => new Vector3()),
  );
  const velocities = useRef(
    Array(SPARK_COUNT_MAX)
      .fill(null)
      .map(() => new Vector3()),
  );
  const emitDurations = useRef(Array(SPARK_COUNT_MAX).fill(0));

  const randomizeVelocities = () => {
    sparkCount.current =
      SPARK_COUNT_MIN +
      Math.floor(Math.random() * (SPARK_COUNT_MAX - SPARK_COUNT_MIN + 1));
    for (let i = 0; i < sparkCount.current; i++) {
      const angle = Math.random() * Math.PI * 2;
      const sideStrength = Math.random() * SIDE_SPEED;
      const upStrength =
        UP_SPEED_MIN + Math.random() * (UP_SPEED_MAX - UP_SPEED_MIN);
      velocities.current[i].set(
        Math.cos(angle) * sideStrength,
        upStrength,
        Math.sin(angle) * sideStrength,
      );
      vectors.current[i].set(0, -0.5, 0);
      prevVectors.current[i].copy(vectors.current[i]);
      emitDurations.current[i] =
        EMIT_DURATION_MIN +
        Math.random() * (EMIT_DURATION_MAX - EMIT_DURATION_MIN);
    }
  };

  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      randomizeVelocities();
      initialized.current = true;
    }

    t.current += delta;

    for (let i = 0; i < sparkCount.current; i++) {
      prevVectors.current[i].copy(vectors.current[i]);
      velocities.current[i].y += GRAVITY * delta;
      vectors.current[i].addScaledVector(velocities.current[i], delta);

      if (t.current > emitDurations.current[i]) continue;

      for (let s = 0; s < SUBSTEPS; s++) {
        const alpha = s / SUBSTEPS;
        _lerpPos.lerpVectors(prevVectors.current[i], vectors.current[i], alpha);
        _dir.copy(velocities.current[i]).normalize();
        emit(_lerpPos.toArray() as [number, number, number], 6, {
          direction: [
            [_dir.x - SPREAD, _dir.x + SPREAD],
            [_dir.y - SPREAD, _dir.y + SPREAD],
            [_dir.z - SPREAD, _dir.z + SPREAD],
          ],
        });
      }
    }

    if (t.current > RESET_DURATION) {
      randomizeVelocities();
      t.current = 0;
      shockwaveState.progress = 0;
      emit([0, 0, 0], 130, {
        direction: [
          [-1, 1],
          [-1, 1],
          [-1, 1],
        ],
        speed: [0.1, 2],
      });
      emit2([0, 0, 0], 100);
    }
  });

  return null;
}

export const HeroScene = () => {
  const text = useLoader(TextureLoader, "/fire.png");
  text.minFilter = NearestFilter;
  text.magFilter = NearestFilter;

  const color1 = color("#fb8d2b").mul(30);

  const sparksColorStart = color("#2bcbfb").mul(60);

  return (
    <>
      <Floor />
      {/* Ambient background particles */}

      <VFXParticles
        name="sparks"
        autoStart={false}
        position={[2, -0.5, 0]}
        intensity={7.4}
        size={[0.001, 0.005]}
        fadeSize={[1, 0]}
        // colorEnd={["#fb0000"]}
        fadeOpacity={[1, 0]}
        gravity={[0, -0.5, 0]}
        speed={[0.1, 1]}
        lifetime={[1, 8]}
        friction={{
          intensity: 0,
          easing: "linear",
        }}
        direction={[
          [-1, 1],
          [0, 1],
          [-1, 1],
        ]}
        startPosition={[
          [0, 0],
          [0, 0],
          [0, 0],
        ]}
        rotation={[0, 0]}
        rotationSpeed={[0, 0]}
        appearance="gradient"
        blending={1}
        lighting="standard"
        emitterShape={1}
        emitterRadius={[0, 1]}
        emitterAngle={0.7853981633974483}
        emitterHeight={[0, 1]}
        emitterDirection={[0, 1, 0]}
        collision={{
          plane: {
            y: -0.98,
          },
          bounce: 0.1,
          friction: 0.5,
          die: false,
          sizeBasedGravity: 0,
        }}
        colorNode={({ progress }) =>
          mix(sparksColorStart, color1, progress.smoothstep(0, 0.3))
        }
      />

      <Sparks />
      <Shockwave />
      <VFXParticles
        autoStart={false}
        name="explosion"
        position={[2, -0.5, 0]}
        maxParticles={500}
        // emitCount={30}
        delay={0.91}
        size={[0.52, 1.44]}
        fadeSize={[0.61, 1]}
        speed={[0.1, 0.82]}
        startPositionAsDirection={true}
        rotation={[
          [0, 0],
          [-6, 6],
          [0, 0],
        ]}
        // appearance="gradient"
        lighting="standard"
        emitterShape={2}
        emitterRadius={[0, 0.27]}
        // alphaMap={text}
        colorNode={({ progress }) =>
          vec4(
            color1.mul(progress.oneMinus().smoothstep(0.6, 0.8)),
            texture(text).a.mul(progress.oneMinus()),
          )
        }
      />
    </>
  );
};
