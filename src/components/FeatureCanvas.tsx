import { useRef, useState, useEffect, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PostProcessing } from "./postprocessing";

/**
 * Wraps a feature scene in a Canvas that mounts on first visibility and
 * stays mounted forever (to avoid WebGPU buffer-destroyed errors).
 * Uses frameloop="never" when off-screen to save GPU work.
 */
export const FeatureCanvas = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible && !mounted) setMounted(true);
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={containerRef} className="scene-canvas">
      {mounted && (
        <Canvas
          renderer={{ forceWebGL: false }}
          frameloop={inView ? "always" : "never"}
        >
          {children}
          <Environment preset="sunset" />
          <PostProcessing />
        </Canvas>
      )}
    </div>
  );
};
