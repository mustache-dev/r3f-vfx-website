import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { VFXParticles, useVFXEmitter } from "r3f-vfx";
import { Vector3 } from "three/webgpu";
import { color, mix } from "three/tsl";
import { FeatureCanvas } from "../FeatureCanvas";

/**
 * Trail rendering demo inspired by the flame repo's SlashVFX sparks.
 * Programmatic emission with trails, velocity curves, and spread.
 */
export const TrailsScene = () => {
  return (
    <FeatureCanvas>
      <TrailEffect />
    </FeatureCanvas>
  );
};

const SPARK_COUNT = 5;
const GRAVITY = -8;
const SIDE_SPEED = 4;
const UP_SPEED_MIN = 3;
const UP_SPEED_MAX = 8;
const EMIT_DURATION = 0.5;
const RESET_INTERVAL = 2.5;
const SUBSTEPS = 4;
const SPREAD = 0.2;

const _lerpPos = new Vector3();
const _dir = new Vector3();

function TrailEmitter() {
  const { emit } = useVFXEmitter("trails");
  const t = useRef(0);

  const vectors = useRef(
    Array(SPARK_COUNT)
      .fill(null)
      .map(() => new Vector3()),
  );
  const prevVectors = useRef(
    Array(SPARK_COUNT)
      .fill(null)
      .map(() => new Vector3()),
  );
  const velocities = useRef(
    Array(SPARK_COUNT)
      .fill(null)
      .map(() => new Vector3()),
  );

  const randomize = () => {
    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const side = Math.random() * SIDE_SPEED;
      const up = UP_SPEED_MIN + Math.random() * (UP_SPEED_MAX - UP_SPEED_MIN);
      velocities.current[i].set(Math.cos(angle) * side, up, Math.sin(angle) * side);
      vectors.current[i].set(0, 0, 0);
      prevVectors.current[i].copy(vectors.current[i]);
    }
  };

  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      randomize();
      initialized.current = true;
    }

    t.current += delta;

    for (let i = 0; i < SPARK_COUNT; i++) {
      prevVectors.current[i].copy(vectors.current[i]);
      velocities.current[i].y += GRAVITY * delta;
      vectors.current[i].addScaledVector(velocities.current[i], delta);

      if (t.current > EMIT_DURATION) continue;

      for (let s = 0; s < SUBSTEPS; s++) {
        const alpha = s / SUBSTEPS;
        _lerpPos.lerpVectors(prevVectors.current[i], vectors.current[i], alpha);
        _dir.copy(velocities.current[i]).normalize();
        emit(_lerpPos.toArray() as [number, number, number], 4, {
          direction: [
            [_dir.x - SPREAD, _dir.x + SPREAD],
            [_dir.y - SPREAD, _dir.y + SPREAD],
            [_dir.z - SPREAD, _dir.z + SPREAD],
          ],
        });
      }
    }

    if (t.current > RESET_INTERVAL) {
      randomize();
      t.current = 0;
    }
  });

  return null;
}

function TrailEffect() {
  const trailColor = color("#ff4e2f").mul(40);
  const trailColorEnd = color("#fb8d2b").mul(20);

  return (
    <>
      <VFXParticles
        name="trails"
        autoStart={false}
        intensity={39.6}
        size={[0.001, 0.005]}
        gravity={[0, -0.5, 0]}
        speed={[0.1, 1]}
        lifetime={[0.9, 0.9]}
        velocityCurve={{
          points: [
            {
              pos: [0, 1],
              handleOut: [0.395, -0.953],
            },
            {
              pos: [1, 0],
              handleIn: [-0.222, -0.048],
            },
          ],
        }}
        direction={[
          [-1, 1],
          [0, 1],
          [-1, 1],
        ]}
        appearance="gradient"
        lighting="standard"
        emitterShape={1}
        colorNode={({ progress }) =>
          mix(trailColor, trailColorEnd, progress.smoothstep(0, 0.5))
        }
        trail={{
          segments: 64,
          width: 0.02,
          taper: true,
          opacity: 1,
          mode: "history",
          length: 4.09,
          showParticles: false,
        }}
      />
      <TrailEmitter />
    </>
  );
}
