import { useRef, useEffect, useState, useCallback } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";

const ayuMirage: PrismTheme = {
  plain: { color: "#CCCAC2", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#5C6773", fontStyle: "italic" as const } },
    { types: ["punctuation"], style: { color: "#CCCAC2" } },
    { types: ["tag", "operator", "number"], style: { color: "#DFBFFF" } },
    { types: ["property", "function"], style: { color: "#FFD580" } },
    { types: ["tag-id", "selector", "atrule-id"], style: { color: "#73D0FF" } },
    { types: ["attr-name"], style: { color: "#FFD580" } },
    { types: ["boolean", "entity", "url", "control", "directive", "unit", "regex"], style: { color: "#95E6CB" } },
    { types: ["keyword", "atrule", "important"], style: { color: "#FFA759" } },
    { types: ["string", "char", "attr-value", "template-string", "template-punctuation"], style: { color: "#BAE67E" } },
    { types: ["variable"], style: { color: "#CBCCC6" } },
    { types: ["builtin", "class-name", "constant"], style: { color: "#73D0FF" } },
    { types: ["deleted"], style: { color: "#F28779" } },
    { types: ["inserted"], style: { color: "#BAE67E" } },
    { types: ["changed"], style: { color: "#FFD580" } },
  ],
};
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ===== Copy button hook ===== */
const useCopyButton = () => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return { copied, copy };
};

/* ===== Sidebar navigation data ===== */
const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
      { id: "frameworks", label: "Framework Support" },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "vfx-particles", label: "VFXParticles" },
      { id: "vfx-emitter", label: "VFXEmitter" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { id: "use-vfx-emitter", label: "useVFXEmitter" },
      { id: "use-vfx-store", label: "useVFXStore" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { id: "appearance", label: "Appearance & Size" },
      { id: "emitter-shapes", label: "Emitter Shapes" },
      { id: "physics", label: "Physics & Forces" },
      { id: "attractors", label: "Attractors" },
      { id: "collisions", label: "Collisions" },
      { id: "lifetime-curves", label: "Lifetime Curves" },
      { id: "trails", label: "Trails" },
      { id: "textures", label: "Textures & Flipbook" },
      { id: "geometry", label: "Geometry & Lighting" },
      { id: "sorting", label: "Sorting" },
      { id: "soft-particles", label: "Soft Particles" },
      { id: "custom-shaders", label: "Custom Shaders (TSL)" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { id: "runtime-overrides", label: "Runtime Overrides" },
      { id: "event-driven", label: "Event-Driven Emission" },
      { id: "named-systems", label: "Named Systems" },
    ],
  },
];

/* ===== Code block component ===== */
const Code = ({
  children,
  filename,
  caption,
}: {
  children: string;
  filename?: string;
  caption?: string;
}) => {
  const { copied, copy } = useCopyButton();
  return (
    <div className="doc-code">
      {filename && (
        <div className="doc-code-header">
          <div className="code-dots">
            <span className="code-dot" />
            <span className="code-dot" />
            <span className="code-dot" />
          </div>
          <span className="code-filename">{filename}</span>
          <button
            className={`doc-code-copy ${copied ? "doc-code-copy--copied" : ""}`}
            onClick={() => copy(children)}
            title="Copy to clipboard"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      )}
      <Highlight theme={ayuMirage} code={children.trim()} language="tsx">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="doc-code-content">
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
      {caption && (
        <div className="doc-code-caption">
          <span>{caption}</span>
        </div>
      )}
    </div>
  );
};

/* ===== Prop table component ===== */
const PropTable = ({
  props,
}: {
  props: { name: string; type: string; default?: string; desc: string }[];
}) => (
  <div className="doc-table-wrap">
    <table className="doc-table">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((p) => (
          <tr key={p.name}>
            <td>
              <code className="doc-inline-code">{p.name}</code>
            </td>
            <td>
              <code className="doc-inline-code doc-inline-code--type">
                {p.type}
              </code>
            </td>
            <td>
              {p.default ? (
                <code className="doc-inline-code">{p.default}</code>
              ) : (
                <span className="doc-table-dash">—</span>
              )}
            </td>
            <td>{p.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ===== Main docs page ===== */
export const DocsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("installation");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation — use fromTo to guarantee final visible state
      gsap.fromTo(
        ".docs-content section",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      gsap.fromTo(
        ".docs-sidebar",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }, containerRef);

    // Intersection observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    const sections = document.querySelectorAll(".docs-content section[id]");
    sections.forEach((s) => observer.observe(s));

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="docs-page">
      {/* Nav */}
      <nav className="nav">
        <a href="#/" className="nav-logo">
          <span className="nav-logo-bracket">[</span>
          r3f-vfx
          <span className="nav-logo-bracket">]</span>
        </a>
        <div className="nav-links">
          <a href="#/" className="nav-link">
            Home
          </a>
          <a href="#/docs" className="nav-link">
            Docs
          </a>
          <a href="#/examples" className="nav-link">
            Examples
          </a>
          <a href="#/store" className="nav-link">
            Store
          </a>
        </div>
        <a
          href="https://github.com/mustache-dev/Three-VFX"
          className="nav-link nav-link--github"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
          <span className="arrow">&#8599;</span>
        </a>
      </nav>

      <div className="docs-layout">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-inner">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="docs-sidebar-group">
                <span className="docs-sidebar-title">{section.title}</span>
                {section.items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`docs-sidebar-link ${activeId === item.id ? "docs-sidebar-link--active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="docs-content">
          {/* ===== INSTALLATION ===== */}
          <section id="installation">
            <div className="docs-section-header">
              <span className="docs-section-label">Getting Started</span>
              <h2 className="docs-section-title">Installation</h2>
            </div>
            <p className="docs-p">
              Three VFX is a high-performance GPU-accelerated particle system for
              Three.js. It targets WebGPU natively and falls back to CPU
              computation when WebGPU is not available. The primary package is{" "}
              <code className="doc-inline-code">r3f-vfx</code> for React Three
              Fiber. Experimental packages are available for vanilla Three.js,
              TresJS (Vue), and Threlte (Svelte).
            </p>
            <Code filename="terminal">
              {`npm install r3f-vfx

# peer dependencies
npm install three @react-three/fiber react react-dom

# optional: trail effects
npm install makio-meshline`}
            </Code>
            <div className="docs-callout">
              <span className="docs-callout-label">Requirements</span>
              <p>
                React 19+, Three.js 0.182+, and @react-three/fiber 9+ or 10+.
                For trail effects, also install{" "}
                <code className="doc-inline-code">makio-meshline</code> (1.0+)
                as a peer dependency.
              </p>
            </div>
          </section>

          {/* ===== QUICK START ===== */}
          <section id="quick-start">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Quick Start</h2>
            </div>
            <p className="docs-p">
              Add a particle system to your scene in a single component. No
              setup, no boilerplate. Use the{" "}
              <code className="doc-inline-code">debug</code> prop to open an
              interactive control panel where you can tweak every parameter
              visually, then copy the generated code.
            </p>
            <Code filename="App.tsx">
              {`import { Canvas } from "@react-three/fiber"
import { VFXParticles } from "r3f-vfx"

function App() {
  return (
    <Canvas>
      <VFXParticles debug />
    </Canvas>
  )
}`}
            </Code>
            <p className="docs-p">
              The particle system is self-contained — it manages its own GPU
              buffers, compute shaders, emission timing, and rendering. Drop it
              into any R3F scene. The debug panel (powered by{" "}
              <code className="doc-inline-code">debug-vfx</code>, lazy-loaded)
              lets you design effects in real time, export curve data to{" "}
              <code className="doc-inline-code">.bin</code> files, and
              copy-paste the prop configuration.
            </p>
          </section>

          {/* ===== FRAMEWORK SUPPORT ===== */}
          <section id="frameworks">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Framework Support</h2>
            </div>
            <p className="docs-p">
              Three VFX is built on a shared{" "}
              <code className="doc-inline-code">core-vfx</code> engine. The
              React binding (<code className="doc-inline-code">r3f-vfx</code>)
              is the primary, production-ready package. Experimental bindings
              exist for other frameworks:
            </p>

            <h3 className="docs-h3">Vanilla Three.js</h3>
            <Code filename="terminal">
              {`npm install vanilla-vfx`}
            </Code>
            <Code filename="main.ts">
              {`import { VFXParticles } from "vanilla-vfx"

const particles = new VFXParticles(renderer, { debug: true })
scene.add(particles.renderObject)`}
            </Code>

            <h3 className="docs-h3">TresJS (Vue)</h3>
            <Code filename="terminal">
              {`npm install tres-vfx`}
            </Code>
            <Code filename="Scene.vue">
              {`<script setup>
import { TresCanvas } from "@tresjs/core"
import { VFXParticles } from "tres-vfx"
</script>

<template>
  <TresCanvas>
    <VFXParticles debug />
  </TresCanvas>
</template>`}
            </Code>

            <h3 className="docs-h3">Threlte (Svelte)</h3>
            <Code filename="terminal">
              {`npm install threlte-vfx`}
            </Code>
            <Code filename="Scene.svelte">
              {`<script>
  import { Canvas } from "@threlte/core"
  import VFXParticles from "threlte-vfx/VFXParticles.svelte"
</script>

<Canvas>
  <VFXParticles debug />
</Canvas>`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Note</span>
              <p>
                The vanilla, TresJS, and Threlte packages are experimental.
                They share the same core-vfx engine and accept the same
                configuration options as the R3F version.
              </p>
            </div>
          </section>

          {/* ===== VFXPARTICLES ===== */}
          <section id="vfx-particles">
            <div className="docs-section-header">
              <span className="docs-section-label">Components</span>
              <h2 className="docs-section-title">
                {"<"}VFXParticles {"/>"}
              </h2>
            </div>
            <p className="docs-p">
              The core component. Each{" "}
              <code className="doc-inline-code">{"<VFXParticles>"}</code>{" "}
              creates an independent GPU particle system with its own buffer,
              material, compute shaders, and emission logic. All simulation
              (physics, turbulence, collisions, sorting) runs on the GPU via
              WebGPU compute shaders.
            </p>

            <Code filename="scene.tsx">
              {`<VFXParticles
  name="fire"
  maxParticles={10000}
  autoStart={true}

  // Appearance
  size={[0.05, 0.18]}
  colorStart={["#FF711E", "#3d91ff"]}
  colorEnd={["#ff6b3500"]}
  fadeOpacity={[1, 0]}
  fadeSize={[1, 0]}
  appearance="gradient"
  blending={2}
  intensity={40}

  // Physics
  gravity={[0, 0.3, 0]}
  speed={[0, 3]}
  lifetime={[0.5, 1]}
  friction={{ intensity: 0, easing: "linear" }}
  direction={[[-1, 1], [0, 1], [-1, 1]]}

  // Emitter
  emitterShape={2}
  emitterRadius={0.3}
  emitterAngle={0.4}
  emitCount={5}
/>`}
            </Code>

            <h3 className="docs-h3">Core Props</h3>
            <PropTable
              props={[
                {
                  name: "name",
                  type: "string",
                  desc: "Register the system in the VFX store. Required for VFXEmitter linking and useVFXEmitter hook.",
                },
                {
                  name: "maxParticles",
                  type: "number",
                  default: "10000",
                  desc: "Maximum particle buffer capacity. Determines GPU buffer allocation.",
                },
                {
                  name: "autoStart",
                  type: "boolean",
                  default: "true",
                  desc: "Begin emission immediately on mount.",
                },
                {
                  name: "emitCount",
                  type: "number",
                  default: "1",
                  desc: "Particles spawned per emission cycle.",
                },
                {
                  name: "delay",
                  type: "number",
                  default: "0",
                  desc: "Seconds between emissions. 0 means emit every frame.",
                },
                {
                  name: "position",
                  type: "[x, y, z]",
                  default: "[0, 0, 0]",
                  desc: "Emitter world position.",
                },
                {
                  name: "debug",
                  type: "boolean",
                  default: "false",
                  desc: "Show interactive debug panel for tweaking props. Lazy-loads debug-vfx.",
                },
              ]}
            />

            <h3 className="docs-h3">Appearance Props</h3>
            <PropTable
              props={[
                {
                  name: "size",
                  type: "number | [min, max]",
                  default: "[0.1, 0.3]",
                  desc: "Particle size or random range.",
                },
                {
                  name: "colorStart",
                  type: "string[]",
                  default: '["#ffffff"]',
                  desc: "Starting color(s) as hex strings. One is picked randomly per particle. Supports alpha via 8-digit hex (e.g. #ff6b3500).",
                },
                {
                  name: "colorEnd",
                  type: "string[] | null",
                  default: "null",
                  desc: "Ending color(s) to lerp toward over lifetime. null = no color transition.",
                },
                {
                  name: "fadeOpacity",
                  type: "number | [start, end]",
                  default: "[1, 0]",
                  desc: "Opacity multiplier over lifetime.",
                },
                {
                  name: "fadeSize",
                  type: "number | [start, end]",
                  default: "[1, 0]",
                  desc: "Size multiplier over lifetime.",
                },
                {
                  name: "appearance",
                  type: '"default" | "gradient" | "circular"',
                  default: '"gradient"',
                  desc: "Visual shape of sprite particles. 'gradient' applies a radial gradient, 'circular' applies a hard circle mask.",
                },
                {
                  name: "blending",
                  type: "1 | 2 | 3 | 4",
                  default: "1 (normal)",
                  desc: "Blend mode: 1=NORMAL, 2=ADDITIVE, 3=SUBTRACTIVE, 4=MULTIPLY.",
                },
                {
                  name: "side",
                  type: "0 | 1 | 2",
                  default: "2 (double)",
                  desc: "Face culling: 0=FRONT, 1=BACK, 2=DOUBLE.",
                },
                {
                  name: "intensity",
                  type: "number",
                  default: "1",
                  desc: "Color brightness multiplier. Values > 1 create glow/bloom when combined with additive blending.",
                },
                {
                  name: "depthTest",
                  type: "boolean",
                  default: "true",
                  desc: "Test against depth buffer.",
                },
                {
                  name: "renderOrder",
                  type: "number",
                  default: "0",
                  desc: "Three.js render order. Higher values render on top.",
                },
              ]}
            />

            <h3 className="docs-h3">Ref Methods</h3>
            <p className="docs-p">
              Access the particle system imperatively via a ref:
            </p>
            <Code filename="controller.tsx">
              {`const particlesRef = useRef(null)

// Spawn 50 particles at a specific position
particlesRef.current.spawn(x, y, z, 50, overrides)

// Control emission
particlesRef.current.start()
particlesRef.current.stop()
particlesRef.current.clear()

// Check state
particlesRef.current.isEmitting`}
            </Code>
            <PropTable
              props={[
                {
                  name: "spawn",
                  type: "(x, y, z, count?, overrides?) => void",
                  desc: "Emit particles at an exact world position. Overrides are applied for this call only.",
                },
                {
                  name: "start",
                  type: "() => void",
                  desc: "Start continuous emission.",
                },
                {
                  name: "stop",
                  type: "() => void",
                  desc: "Stop continuous emission.",
                },
                {
                  name: "clear",
                  type: "() => void",
                  desc: "Kill all living particles immediately.",
                },
                {
                  name: "isEmitting",
                  type: "boolean",
                  desc: "Current emission state.",
                },
                {
                  name: "uniforms",
                  type: "Record<string, Node>",
                  desc: "Direct access to GPU uniform values.",
                },
              ]}
            />
          </section>

          {/* ===== VFXEMITTER ===== */}
          <section id="vfx-emitter">
            <div className="docs-section-header">
              <h2 className="docs-section-title">
                {"<"}VFXEmitter {"/>"}
              </h2>
            </div>
            <p className="docs-p">
              A decoupled emitter component that links to a named{" "}
              <code className="doc-inline-code">VFXParticles</code> system.
              Place emitters anywhere in your scene tree — on characters, at
              impact points, following objects. Multiple emitters can share a
              single particle system without extra draw calls.
            </p>

            <Code
              filename="PlayerController.tsx"
              caption="Emitter attached to a player character"
            >
              {`import { VFXParticles, VFXEmitter } from "r3f-vfx"

// 1. Define the particle system once
<VFXParticles
  name="dodge"
  autoStart={false}
  maxParticles={100}
  size={[2, 2]}
  colorStart={["#63acff"]}
  fadeOpacity={[0.01, 0]}
  lifetime={[0.3, 0.3]}
  emitterShape={1}
/>

// 2. Attach emitters to scene objects
<group ref={playerRef}>
  <VFXEmitter
    ref={dodgeEmitterRef}
    name="dodge"
    position={[0, 0.1, 0]}
    emitCount={1}
    autoStart={false}
    delay={0}
  />
</group>

// 3. Control programmatically
dodgeEmitterRef.current?.start()   // begin continuous emission
dodgeEmitterRef.current?.stop()    // stop emitting
dodgeEmitterRef.current?.emit()    // single burst
dodgeEmitterRef.current?.burst(20) // emit N particles once`}
            </Code>

            <h3 className="docs-h3">Emitter Props</h3>
            <PropTable
              props={[
                {
                  name: "name",
                  type: "string",
                  desc: "Name of the VFXParticles system to emit from. Links via the global Zustand store.",
                },
                {
                  name: "particlesRef",
                  type: "Ref",
                  desc: "Direct ref to a VFXParticles instance (alternative to name). Use when you don't want to register in the store.",
                },
                {
                  name: "position",
                  type: "[x, y, z]",
                  default: "[0, 0, 0]",
                  desc: "Local position offset. Particles spawn at the emitter's world position (group transform + this offset).",
                },
                {
                  name: "emitCount",
                  type: "number",
                  default: "10",
                  desc: "Number of particles spawned per emission cycle.",
                },
                {
                  name: "delay",
                  type: "number",
                  default: "0",
                  desc: "Seconds between emissions. 0 = emit every frame.",
                },
                {
                  name: "autoStart",
                  type: "boolean",
                  default: "true",
                  desc: "Begin emitting automatically on mount.",
                },
                {
                  name: "loop",
                  type: "boolean",
                  default: "true",
                  desc: "Continuously loop emission. When false, emits once then stops.",
                },
                {
                  name: "localDirection",
                  type: "boolean",
                  default: "false",
                  desc: "Transform the direction vector by the parent's quaternion rotation. Essential when the emitter is attached to a moving/rotating object.",
                },
                {
                  name: "direction",
                  type: "Range3D",
                  desc: "Direction override for this emitter. When set with localDirection, the direction rotates with the parent object.",
                },
                {
                  name: "overrides",
                  type: "SpawnOverrides",
                  desc: "Per-spawn property overrides applied on every emission from this emitter. See Overridable Properties below.",
                },
                {
                  name: "onEmit",
                  type: "(params) => void",
                  desc: "Callback fired after each emission. Receives { position: [x,y,z], count: number, direction }.",
                },
                {
                  name: "children",
                  type: "ReactNode",
                  desc: "Child elements rendered inside the emitter's group. Useful for attaching visuals to the emission point.",
                },
              ]}
            />

            <h3 className="docs-h3">Overridable Properties</h3>
            <p className="docs-p">
              The{" "}
              <code className="doc-inline-code">overrides</code> prop (and the
              overrides parameter in{" "}
              <code className="doc-inline-code">emit()</code> /{" "}
              <code className="doc-inline-code">spawn()</code>) temporarily
              changes particle properties for that single emission only. The
              base VFXParticles config is never modified. The following
              properties can be overridden:
            </p>
            <PropTable
              props={[
                {
                  name: "size",
                  type: "number | [min, max]",
                  desc: "Override particle size range.",
                },
                {
                  name: "speed",
                  type: "number | [min, max]",
                  desc: "Override initial velocity magnitude.",
                },
                {
                  name: "lifetime",
                  type: "number | [min, max]",
                  desc: "Override particle lifespan.",
                },
                {
                  name: "direction",
                  type: "Range3D",
                  desc: "Override emission direction per axis.",
                },
                {
                  name: "startPosition",
                  type: "Range3D",
                  desc: "Override spawn position offset.",
                },
                {
                  name: "gravity",
                  type: "[x, y, z]",
                  desc: "Override gravity vector.",
                },
                {
                  name: "colorStart",
                  type: "string[]",
                  desc: "Override starting colors (up to 8).",
                },
                {
                  name: "colorEnd",
                  type: "string[]",
                  desc: "Override ending colors (up to 8).",
                },
                {
                  name: "rotation",
                  type: "Range3D",
                  desc: "Override initial rotation.",
                },
                {
                  name: "emitterShape",
                  type: "0-5",
                  desc: "Override emitter shape type.",
                },
                {
                  name: "emitterRadius",
                  type: "number | [inner, outer]",
                  desc: "Override emitter radius.",
                },
                {
                  name: "emitterAngle",
                  type: "number",
                  desc: "Override cone angle.",
                },
                {
                  name: "emitterHeight",
                  type: "number | [min, max]",
                  desc: "Override cone height.",
                },
                {
                  name: "emitterSurfaceOnly",
                  type: "boolean",
                  desc: "Override surface-only emission.",
                },
                {
                  name: "emitterDirection",
                  type: "[x, y, z]",
                  desc: "Override emitter normal direction.",
                },
              ]}
            />

            <Code
              filename="emitter-overrides.tsx"
              caption="Using overrides on a VFXEmitter"
            >
              {`// Emitter with per-spawn overrides
<VFXEmitter
  name="sparks"
  emitCount={10}
  delay={0.1}
  overrides={{
    colorStart: ["#ff0000", "#ff8800"],
    speed: [2, 5],
    direction: [[0, 0], [1, 1], [0, 0]],  // emit upward only
  }}
/>

// Direction + localDirection for attached emitters
// The direction rotates with the parent object
<group ref={swordRef}>
  <VFXEmitter
    name="slash-sparks"
    direction={[[0, 0], [0, 0], [-1, -1]]}  // emit along -Z
    localDirection={true}                     // rotate with sword
    emitCount={4}
    delay={0}
  />
</group>`}
            </Code>

            <Code
              filename="programmatic-overrides.tsx"
              caption="Programmatic emission with overrides"
            >
              {`// Via ref: emit() accepts overrides for that call only
dodgeEmitterRef.current?.emit({
  colorStart: ["#63acff"],
  size: [2, 2],
  speed: [0.5, 1],
})

// Via useVFXEmitter hook: position + count + overrides
const { emit } = useVFXEmitter("sparks")
emit([x, y, z], 50, {
  direction: [[-1, -1], [0, 0], [0, 0]],
  gravity: [0, -20, 0],
  colorStart: ["#ff0000"],
})`}
            </Code>

            <h3 className="docs-h3">Ref Methods</h3>
            <PropTable
              props={[
                {
                  name: "emit",
                  type: "(overrides?) => boolean",
                  desc: "Emit at current world position. Accepts optional per-call overrides.",
                },
                {
                  name: "burst",
                  type: "(count?) => boolean",
                  desc: "One-shot burst of N particles at current position.",
                },
                {
                  name: "start",
                  type: "() => void",
                  desc: "Start auto-emission loop.",
                },
                {
                  name: "stop",
                  type: "() => void",
                  desc: "Stop auto-emission.",
                },
                {
                  name: "isEmitting",
                  type: "boolean",
                  desc: "Current emission state.",
                },
                {
                  name: "getParticleSystem",
                  type: "() => ParticleAPI",
                  desc: "Access the linked VFXParticles system directly.",
                },
                {
                  name: "group",
                  type: "THREE.Group",
                  desc: "The underlying Three.js group element for manual transforms.",
                },
              ]}
            />

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Architecture</span>
              <p>
                Multiple VFXEmitters can share a single VFXParticles system
                with zero extra draw calls. Define one{" "}
                <code className="doc-inline-code">
                  {"<VFXParticles name=\"sparks\" />"}
                </code>{" "}
                and scatter{" "}
                <code className="doc-inline-code">
                  {"<VFXEmitter name=\"sparks\" />"}
                </code>{" "}
                across your scene tree — each emitter uses the same GPU buffers
                and material, only varying the spawn position and overrides.
              </p>
            </div>
          </section>

          {/* ===== useVFXEmitter HOOK ===== */}
          <section id="use-vfx-emitter">
            <div className="docs-section-header">
              <span className="docs-section-label">Hooks</span>
              <h2 className="docs-section-title">useVFXEmitter</h2>
            </div>
            <p className="docs-p">
              Programmatic control hook for named particle systems. Use this
              when you need to trigger particles from game logic, event
              handlers, or other non-component code. Links to a VFXParticles
              system by name through the global Zustand store.
            </p>

            <Code filename="enemyDeath.tsx">
              {`import { useVFXEmitter } from "r3f-vfx"

const EnemyDeath = () => {
  const { emit } = useVFXEmitter("death")
  const { emit: emitCircle } = useVFXEmitter("death-ring")

  useEffect(() => {
    eventBus.on("enemy-dead", (position) => {
      const { x, y, z } = position
      emit([x, y, z], 50)       // position + count
      emitCircle([x, y, z], 1)  // single ring burst
    })
  }, [emit, emitCircle])

  return null
}`}
            </Code>

            <h3 className="docs-h3">Return Value</h3>
            <PropTable
              props={[
                {
                  name: "emit",
                  type: "(pos?, count?, overrides?) => boolean",
                  desc: "Emit particles at a world position with optional property overrides. Returns true if the system was found.",
                },
                {
                  name: "burst",
                  type: "(pos?, count?, overrides?) => boolean",
                  desc: "One-shot burst emission.",
                },
                {
                  name: "start",
                  type: "() => boolean",
                  desc: "Start continuous emission.",
                },
                {
                  name: "stop",
                  type: "() => boolean",
                  desc: "Stop continuous emission.",
                },
                {
                  name: "clear",
                  type: "() => boolean",
                  desc: "Kill all living particles.",
                },
                {
                  name: "isEmitting",
                  type: "() => boolean",
                  desc: "Check if currently emitting.",
                },
                {
                  name: "getUniforms",
                  type: "() => Record<string, unknown>",
                  desc: "Access GPU uniform values.",
                },
                {
                  name: "getParticles",
                  type: "() => ParticleSystemRef | null",
                  desc: "Access the underlying particle system ref for direct control.",
                },
              ]}
            />
          </section>

          {/* ===== useVFXStore HOOK ===== */}
          <section id="use-vfx-store">
            <div className="docs-section-header">
              <h2 className="docs-section-title">useVFXStore</h2>
            </div>
            <p className="docs-p">
              Zustand store for low-level access to all registered particle
              systems. Use this when you need to manage multiple systems
              directly or access the particle registry.
            </p>

            <Code filename="store.tsx">
              {`import { useVFXStore } from "r3f-vfx"

// Access as a hook (reactive)
const particles = useVFXStore((state) => state.particles)

// Access outside React components
const store = useVFXStore.getState()
store.emit("sparks", { x: 0, y: 1, z: 0, count: 20 })
store.start("sparks")
store.stop("sparks")
store.clear("sparks")

// Get a specific particle system
const sparks = store.getParticles("sparks")
sparks?.spawn(0, 0, 0, 50)`}
            </Code>

            <h3 className="docs-h3">Store Methods</h3>
            <PropTable
              props={[
                {
                  name: "particles",
                  type: "Record<string, ParticleSystemRef>",
                  desc: "Map of all registered particle systems by name.",
                },
                {
                  name: "registerParticles",
                  type: "(name, ref) => void",
                  desc: "Register a particle system (done automatically by VFXParticles with a name prop).",
                },
                {
                  name: "unregisterParticles",
                  type: "(name) => void",
                  desc: "Remove a particle system from the store.",
                },
                {
                  name: "getParticles",
                  type: "(name) => ParticleSystemRef | null",
                  desc: "Get a specific registered system.",
                },
                {
                  name: "emit",
                  type: '(name, options?) => boolean',
                  desc: "Emit from a named system. Options: { x?, y?, z?, count?, overrides? }.",
                },
                {
                  name: "start / stop / clear",
                  type: "(name) => boolean",
                  desc: "Control a named system. Returns false if system not found.",
                },
                {
                  name: "isEmitting",
                  type: "(name) => boolean",
                  desc: "Check emission state of a named system.",
                },
                {
                  name: "getUniforms",
                  type: "(name) => Record | null",
                  desc: "Access GPU uniforms of a named system.",
                },
              ]}
            />
          </section>

          {/* ===== APPEARANCE ===== */}
          <section id="appearance">
            <div className="docs-section-header">
              <span className="docs-section-label">Configuration</span>
              <h2 className="docs-section-title">Appearance & Size</h2>
            </div>
            <p className="docs-p">
              Control how particles look — size, color, opacity, blend mode,
              rotation, and intensity. Most props accept ranges{" "}
              <code className="doc-inline-code">[min, max]</code> for
              per-particle randomization.
            </p>

            <Code filename="appearance.tsx">
              {`<VFXParticles
  // Size: random between 0.04 and 0.1
  size={[0.04, 0.1]}
  fadeSize={[0.2, 1]}         // grow from 20% to 100% over life

  // Colors: random pick from array per particle
  colorStart={["#FF711E", "#3d91ff"]}
  colorEnd={["#ff6b3500"]}     // 8-digit hex for alpha
  fadeOpacity={[1, 0]}         // fade out over lifetime

  // Rendering
  appearance="circular"        // "default" | "gradient" | "circular"
  blending={2}                 // 2 = ADDITIVE (glow effect)
  intensity={40}               // brightness multiplier

  // Rotation: per-axis ranges [min, max] in radians
  rotation={[[-3.4, 6.7], [-7.6, 6.7], [-5.4, 6.4]]}
  rotationSpeed={[[-6.3, 5.9], [-5.9, 6], [-6.6, 6]]}
/>`}
            </Code>

            <h3 className="docs-h3">Rotation Input Formats</h3>
            <p className="docs-p">
              Rotation and direction props accept flexible input formats:
            </p>
            <Code filename="rotation-formats.tsx">
              {`// Single value: applied to all axes
rotation={0}

// Range: random between min/max, applied to all axes
rotation={[-Math.PI, Math.PI]}

// Per-axis ranges: independent control per axis
rotation={[
  [-Math.PI, Math.PI],     // X axis
  [0, 0],                  // Y axis (no rotation)
  [-Math.PI, Math.PI],     // Z axis
]}`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Tip</span>
              <p>
                The same input format applies to{" "}
                <code className="doc-inline-code">direction</code>,{" "}
                <code className="doc-inline-code">startPosition</code>,{" "}
                <code className="doc-inline-code">rotation</code>, and{" "}
                <code className="doc-inline-code">rotationSpeed</code>.
              </p>
            </div>
          </section>

          {/* ===== EMITTER SHAPES ===== */}
          <section id="emitter-shapes">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Emitter Shapes</h2>
            </div>
            <p className="docs-p">
              Control where particles spawn. Six built-in shapes cover most use
              cases. Use the{" "}
              <code className="doc-inline-code">EmitterShape</code> enum or
              numeric values:
            </p>

            <div className="docs-shapes-grid">
              {[
                {
                  shape: 0,
                  name: "POINT",
                  desc: "All particles spawn at origin",
                },
                {
                  shape: 1,
                  name: "BOX",
                  desc: "Random within a box volume",
                },
                {
                  shape: 2,
                  name: "SPHERE",
                  desc: "Random within a sphere",
                },
                { shape: 3, name: "CONE", desc: "Cone-shaped emission" },
                { shape: 4, name: "DISK", desc: "Flat circular area" },
                {
                  shape: 5,
                  name: "EDGE",
                  desc: "Along a line/edge",
                },
              ].map((s) => (
                <div key={s.shape} className="docs-shape-card">
                  <span className="docs-shape-num">{s.shape}</span>
                  <span className="docs-shape-name">{s.name}</span>
                  <span className="docs-shape-desc">{s.desc}</span>
                </div>
              ))}
            </div>

            <PropTable
              props={[
                {
                  name: "emitterShape",
                  type: "0-5",
                  default: "1 (BOX)",
                  desc: "Shape type: POINT(0), BOX(1), SPHERE(2), CONE(3), DISK(4), EDGE(5).",
                },
                {
                  name: "emitterRadius",
                  type: "number | [inner, outer]",
                  default: "[0, 1]",
                  desc: "Radius range for sphere/cone/disk. Inner > 0 creates a hollow shape.",
                },
                {
                  name: "emitterAngle",
                  type: "number",
                  default: "π/4",
                  desc: "Cone opening angle in radians.",
                },
                {
                  name: "emitterHeight",
                  type: "number | [min, max]",
                  default: "[0, 1]",
                  desc: "Height range for cone shape.",
                },
                {
                  name: "emitterDirection",
                  type: "[x, y, z]",
                  default: "[0, 1, 0]",
                  desc: "Normal direction for cone/disk emitters.",
                },
                {
                  name: "emitterSurfaceOnly",
                  type: "boolean",
                  default: "false",
                  desc: "Emit from the surface only (not the volume interior).",
                },
                {
                  name: "startPosition",
                  type: "Range3D",
                  default: "[[0,0],[0,0],[0,0]]",
                  desc: "Additional position offset per axis.",
                },
                {
                  name: "startPositionAsDirection",
                  type: "boolean",
                  default: "false",
                  desc: "Use the spawn position offset as velocity direction. Creates radial outward emission from center.",
                },
              ]}
            />

            <Code filename="emitters.tsx">
              {`// Sphere surface emission (great for explosions)
<VFXParticles
  emitterShape={2}
  emitterRadius={0.3}
  emitterSurfaceOnly={true}
  startPositionAsDirection={true}  // radial outward velocity
/>

// Cone emission (fire, jet exhaust)
<VFXParticles
  emitterShape={3}
  emitterAngle={0.4}
  emitterHeight={[0, 2.13]}
  emitterDirection={[0, 1, 0]}
/>

// Hollow ring (portals)
<VFXParticles
  emitterShape={4}
  emitterRadius={[0.8, 1]}
  emitterSurfaceOnly={true}
/>`}
            </Code>
          </section>

          {/* ===== PHYSICS ===== */}
          <section id="physics">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Physics & Forces</h2>
            </div>
            <p className="docs-p">
              All physics are computed on the GPU via WebGPU compute shaders.
              When WebGPU isn't available, the library automatically falls back
              to CPU computation with the same behavior.
            </p>

            <Code filename="physics.tsx">
              {`<VFXParticles
  // Velocity
  speed={[0, 4.47]}
  direction={[[-1, 1], [0, 1], [-1, 1]]}  // random 3D direction
  lifetime={[1, 3]}

  // Gravity: [x, y, z] constant acceleration
  gravity={[0, -15, 0]}       // strong downward pull

  // Turbulence (3D curl noise)
  turbulence={{
    intensity: 400,            // force strength
    frequency: 2.7,            // noise spatial scale
    speed: 1,                  // noise animation speed
  }}

  // Friction: slow particles over time
  friction={{
    intensity: 0.5,            // drag amount (also accepts [min, max])
    easing: "easeOut",         // "linear" | "easeIn" | "easeOut" | "easeInOut"
  }}
/>`}
            </Code>

            <PropTable
              props={[
                {
                  name: "speed",
                  type: "number | [min, max]",
                  default: "[0.1, 0.1]",
                  desc: "Initial velocity magnitude. Randomized per particle when given as a range.",
                },
                {
                  name: "direction",
                  type: "Range3D",
                  default: "[[-1,1],[0,1],[-1,1]]",
                  desc: "Direction range per axis. Combined with speed to produce initial velocity.",
                },
                {
                  name: "gravity",
                  type: "[x, y, z]",
                  default: "[0, 0, 0]",
                  desc: "Constant acceleration vector applied every frame.",
                },
                {
                  name: "turbulence",
                  type: "TurbulenceConfig | null",
                  desc: "3D curl noise disturbance. Adds organic, swirling motion.",
                },
                {
                  name: "friction",
                  type: "FrictionConfig",
                  default: "{ intensity: 0 }",
                  desc: "Velocity damping over lifetime. Intensity can be a [min, max] range.",
                },
                {
                  name: "lifetime",
                  type: "number | [min, max]",
                  default: "[1, 2]",
                  desc: "Particle lifespan in seconds. After this time, the particle is recycled.",
                },
              ]}
            />

            <Code
              filename="types.ts"
              caption="TypeScript interfaces"
            >
              {`interface TurbulenceConfig {
  intensity: number   // Force strength
  frequency?: number  // Noise spatial scale (default varies)
  speed?: number      // Noise animation speed (default varies)
}

interface FrictionConfig {
  intensity?: number | [number, number]  // Drag amount or range
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut"
}`}
            </Code>
          </section>

          {/* ===== ATTRACTORS ===== */}
          <section id="attractors">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Attractors</h2>
            </div>
            <p className="docs-p">
              Up to 4 attractors per particle system. Point attractors pull (or
              repel) particles toward a position. Vortex attractors spin
              particles around an axis.
            </p>

            <Code filename="attractors.tsx">
              {`<VFXParticles
  attractors={[
    // Point attractor: pulls everything to center
    {
      position: [0, 0, 0],
      strength: 2,             // positive = attract, negative = repel
      radius: 4,               // 0 = infinite range
      type: "point",           // "point" or "vortex"
    },
    // Vortex: swirls around Y axis
    {
      position: [0, 1, 0],
      strength: 3,
      radius: 5,
      type: "vortex",
      axis: [0, 1, 0],         // spin axis
    },
  ]}

  // Shorthand: pull all particles toward emitter center
  attractToCenter={true}
/>`}
            </Code>

            <PropTable
              props={[
                {
                  name: "attractors",
                  type: "AttractorConfig[]",
                  desc: "Array of up to 4 attractor configurations.",
                },
                {
                  name: "attractToCenter",
                  type: "boolean",
                  default: "false",
                  desc: "Shorthand: particles move from spawn position toward center over lifetime.",
                },
              ]}
            />

            <Code filename="types.ts" caption="AttractorConfig interface">
              {`interface AttractorConfig {
  position?: [number, number, number]  // World position
  strength?: number    // Positive = attract, negative = repel
  radius?: number      // Effect radius (0 = infinite range)
  type?: "point" | "vortex"
  axis?: [number, number, number]  // Rotation axis (vortex only)
}`}
            </Code>
          </section>

          {/* ===== COLLISIONS ===== */}
          <section id="collisions">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Collisions</h2>
            </div>
            <p className="docs-p">
              Infinite horizontal plane collision with configurable bounce,
              friction, and death-on-impact. Computed in the GPU update shader.
            </p>

            <Code filename="collision.tsx">
              {`<VFXParticles
  gravity={[0, -15, 0]}
  speed={[0, 4.47]}
  lifetime={[1, 3]}
  appearance="circular"
  blending={2}
  collision={{
    plane: { y: -1 },           // collision surface Y position
    bounce: 0.47,               // energy retained (0 = no bounce, 1 = perfect)
    friction: 0.41,             // horizontal slowdown on contact
    die: false,                 // kill particle on first collision
    sizeBasedGravity: 0,        // scale gravity by particle size
  }}
/>`}
            </Code>

            <PropTable
              props={[
                {
                  name: "plane",
                  type: "{ y: number }",
                  desc: "The Y position of the collision plane.",
                },
                {
                  name: "bounce",
                  type: "number",
                  desc: "Bounce factor (0 = no bounce, 1 = perfect elastic bounce).",
                },
                {
                  name: "friction",
                  type: "number",
                  desc: "Horizontal friction applied on contact.",
                },
                {
                  name: "die",
                  type: "boolean",
                  desc: "Kill the particle on first collision.",
                },
                {
                  name: "sizeBasedGravity",
                  type: "number",
                  desc: "Multiplier to scale gravity based on particle size. Larger particles fall faster.",
                },
              ]}
            />
          </section>

          {/* ===== LIFETIME CURVES ===== */}
          <section id="lifetime-curves">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Lifetime Curves</h2>
            </div>
            <p className="docs-p">
              Bezier curves let you precisely control how size, opacity,
              velocity, and rotation speed change over a particle's lifetime.
              Four curve channels are available, each baked into a single RGBA
              texture at 256px resolution.
            </p>

            <PropTable
              props={[
                {
                  name: "fadeSizeCurve",
                  type: "CurveData",
                  desc: "Size multiplier over lifetime (R channel).",
                },
                {
                  name: "fadeOpacityCurve",
                  type: "CurveData",
                  desc: "Opacity multiplier over lifetime (G channel).",
                },
                {
                  name: "velocityCurve",
                  type: "CurveData",
                  desc: "Velocity multiplier over lifetime (B channel). Overrides friction when set.",
                },
                {
                  name: "rotationSpeedCurve",
                  type: "CurveData",
                  desc: "Rotation speed multiplier over lifetime (A channel).",
                },
                {
                  name: "curveTexturePath",
                  type: "string",
                  desc: "Path to a pre-baked .bin file. Faster than inline curves (skips runtime baking).",
                },
              ]}
            />

            <Code filename="curves.tsx">
              {`// Inline bezier curve for velocity
<VFXParticles
  velocityCurve={{
    points: [
      { pos: [0, 1], handleOut: [0.1, 0] },
      { pos: [0.5, 0.2],
        handleIn: [-0.1, 0],
        handleOut: [0.1, 0] },
      { pos: [1, 0], handleIn: [-0.1, 0] },
    ],
  }}
  fadeSizeCurve={{
    points: [
      { pos: [0, 0.2] },
      { pos: [0.5, 1] },   // peak at 50% life
      { pos: [1, 0] },
    ],
  }}
/>

// Pre-baked curve texture (exported from debug panel)
<VFXParticles curveTexturePath="./vfx/impact.bin" />`}
            </Code>

            <Code filename="types.ts" caption="CurveData format">
              {`interface CurveData {
  points: CurvePoint[]
}

interface CurvePoint {
  pos: [number, number]        // [x: 0-1 progress, y: value]
  handleIn?: [number, number]  // Bezier handle offset (incoming)
  handleOut?: [number, number] // Bezier handle offset (outgoing)
}

// Channel bitmask for .bin files
const CurveChannel = {
  SIZE: 1,            // R channel
  OPACITY: 2,         // G channel
  VELOCITY: 4,        // B channel
  ROTATION_SPEED: 8,  // A channel
}`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Workflow</span>
              <p>
                Use{" "}
                <code className="doc-inline-code">{"debug={true}"}</code> to
                open the interactive debug panel. Tweak curves visually with
                bezier handles, then export to{" "}
                <code className="doc-inline-code">.bin</code> files for
                production use. This skips runtime curve baking for faster
                startup.
              </p>
            </div>
          </section>

          {/* ===== TRAILS ===== */}
          <section id="trails">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Trails</h2>
            </div>
            <p className="docs-p">
              GPU-based trail rendering using{" "}
              <code className="doc-inline-code">makio-meshline</code>. Trails
              record particle positions into a ring buffer each frame and render
              them as tapered mesh lines. Requires{" "}
              <code className="doc-inline-code">makio-meshline</code> (1.0+)
              installed as a peer dependency.
            </p>

            <Code filename="terminal">
              {`npm install makio-meshline`}
            </Code>

            <Code filename="trails.tsx" caption="Trail configuration">
              {`<VFXParticles
  name="trails"
  autoStart={false}
  size={[0.001, 0.005]}
  speed={[0.1, 1]}
  lifetime={[0.9, 0.9]}
  gravity={[0, -0.5, 0]}
  intensity={39.6}
  appearance="gradient"
  trail={{
    segments: 64,          // trail resolution (number of line points)
    width: 0.02,           // line width
    taper: true,           // taper width from head to tail
    opacity: 1,            // global opacity (number or TSL callback)
    length: 4.09,          // history length in seconds
    showParticles: false,  // hide the point sprites, show only trails
  }}
/>`}
            </Code>

            <h3 className="docs-h3">TrailConfig</h3>
            <PropTable
              props={[
                {
                  name: "segments",
                  type: "number",
                  default: "32",
                  desc: "Number of trail line segments. Higher = smoother but more geometry.",
                },
                {
                  name: "width",
                  type: "number",
                  default: "0.1",
                  desc: "Base line width.",
                },
                {
                  name: "taper",
                  type: "boolean | (t) => number",
                  default: "true",
                  desc: "Width taper control. true = linear taper (thick head, thin tail). false = uniform. Function receives t (0=head, 1=tail) and returns width multiplier.",
                },
                {
                  name: "opacity",
                  type: "number | (data) => Node",
                  default: "1",
                  desc: "Global opacity (number) or per-vertex TSL callback with particle data.",
                },
                {
                  name: "length",
                  type: "number",
                  default: "0.5",
                  desc: "Trail history length in seconds.",
                },
                {
                  name: "showParticles",
                  type: "boolean",
                  default: "true",
                  desc: "Show point sprite particles alongside trails.",
                },
                {
                  name: "fragmentColorFn",
                  type: "(data: TrailData) => Node",
                  desc: "Per-pixel trail coloring in fragment shader. Receives full particle + meshline data.",
                },
              ]}
            />

            <h3 className="docs-h3">Taper Examples</h3>
            <Code filename="taper.tsx">
              {`// Default linear taper (thick at head, thin at tail)
trail={{ taper: true }}

// No tapering (uniform width)
trail={{ taper: false }}

// Custom: fat middle, thin ends
trail={{ taper: (t) => Math.sin(t * Math.PI) }}

// Custom: wavy trail
trail={{ taper: (t) => Math.abs(Math.sin(t * Math.PI * 4)) }}`}
            </Code>

            <h3 className="docs-h3">Opacity TSL Callback</h3>
            <p className="docs-p">
              When{" "}
              <code className="doc-inline-code">opacity</code> is a function,
              it runs per-vertex in the fragment shader with full access to
              particle data:
            </p>
            <Code filename="trail-opacity.tsx">
              {`trail={{
  opacity: ({
    alpha,           // base alpha from MeshLine
    trailProgress,   // 0 (head) → 1 (tail)
    side,            // -1 or 1 (left/right side of line)
    progress,        // particle lifetime progress (0 → 1)
    lifetime,        // remaining lifetime (1 → 0)
    position,        // vec3 world position
    velocity,        // vec3 velocity
    size,            // float particle size
    colorStart,      // vec3 start color
    colorEnd,        // vec3 end color
    particleColor,   // vec3 interpolated color
    index,           // particle index
  }) => {
    // Fade based on trail position and particle age
    return alpha.mul(trailProgress.oneMinus()).mul(lifetime)
  }
}}`}
            </Code>

            <h3 className="docs-h3">Fragment Color Function</h3>
            <p className="docs-p">
              The{" "}
              <code className="doc-inline-code">fragmentColorFn</code> callback
              runs in the fragment shader for per-pixel trail coloring. It
              receives all the data from the opacity callback plus additional
              meshline-specific fields:
            </p>
            <Code filename="trail-color.tsx">
              {`trail={{
  fragmentColorFn: ({
    color,              // vec3 current trail color
    uv,                 // vec2 meshline UV coordinates
    trailProgress,      // 0 (head) → 1 (tail)
    side,               // -1 or 1
    progress,           // particle lifetime progress
    lifetime,           // remaining lifetime
    position,           // vec3 world position
    velocity,           // vec3 velocity
    size,               // float particle size
    particleColor,      // vec3 interpolated particle color
    intensifiedColor,   // color × intensity
    index,              // particle index
  }) => {
    // Gradient from hot to cool along trail
    return mix(color("#ff4400").mul(20), color("#0044ff"), trailProgress)
  }
}}`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Performance</span>
              <p>
                Trail history is stored in a GPU ring buffer and updated via
                compute shader each frame. Each particle gets its own trail
                segment, so{" "}
                <code className="doc-inline-code">maxParticles × segments</code>{" "}
                determines GPU memory usage. Keep segments reasonable (32-128)
                for large particle counts.
              </p>
            </div>
          </section>

          {/* ===== TEXTURES & FLIPBOOK ===== */}
          <section id="textures">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Textures & Flipbook</h2>
            </div>
            <p className="docs-p">
              Apply textures as alpha masks or animated sprite sheets (flipbook).
              Textures are sampled in the fragment shader and can be combined
              with{" "}
              <code className="doc-inline-code">colorNode</code> for full
              creative control.
            </p>

            <PropTable
              props={[
                {
                  name: "alphaMap",
                  type: "THREE.Texture",
                  desc: "Alpha/shape texture. The texture's alpha channel is used to mask particle shape.",
                },
                {
                  name: "flipbook",
                  type: "FlipbookConfig | null",
                  desc: "Animated sprite sheet configuration. Automatically advances frames over particle lifetime.",
                },
              ]}
            />

            <Code filename="types.ts" caption="FlipbookConfig interface">
              {`interface FlipbookConfig {
  rows: number     // Number of rows in the sprite sheet
  columns: number  // Number of columns in the sprite sheet
}`}
            </Code>

            <Code
              filename="flipbook.tsx"
              caption="Fire effect using texture alpha + colorNode"
            >
              {`import { useLoader } from "@react-three/fiber"
import { TextureLoader, NearestFilter, SRGBColorSpace } from "three"
import { color, mix, texture, vec4 } from "three/tsl"

function FireEffect() {
  const tex = useLoader(TextureLoader, "/fire.png")
  tex.colorSpace = SRGBColorSpace
  tex.minFilter = NearestFilter
  tex.magFilter = NearestFilter

  return (
    <VFXParticles
      emitterShape={2}
      emitterRadius={[0, 0.5]}
      emitCount={6}
      size={[0.3, 0.8]}
      fadeSize={[0.6, 1]}
      speed={[0.1, 0.5]}
      lifetime={[1, 2.5]}
      gravity={[0, 0.8, 0]}
      appearance="gradient"
      blending={2}
      // Use texture alpha with color progression
      colorNode={({ progress }) =>
        vec4(
          mix(
            color("#fb8d2b").mul(30),
            color("#ff2200").mul(5),
            progress.smoothstep(0.3, 0.8),
          ),
          texture(tex).a.pow(2)
            .mul(progress.oneMinus().smoothstep(0, 0.6)),
        )
      }
    />
  )
}`}
            </Code>

            <Code
              filename="flipbook-grid.tsx"
              caption="Animated 4×4 sprite sheet"
            >
              {`<VFXParticles
  alphaMap={spriteSheetTexture}
  flipbook={{ rows: 4, columns: 4 }}
  size={0.5}
  lifetime={1}
/>`}
            </Code>
          </section>

          {/* ===== GEOMETRY & LIGHTING ===== */}
          <section id="geometry">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Geometry & Lighting</h2>
            </div>
            <p className="docs-p">
              Replace flat billboard sprites with 3D geometry. When a{" "}
              <code className="doc-inline-code">geometry</code> prop is
              provided, VFXParticles switches to instanced mesh mode with full
              PBR lighting support.
            </p>

            <PropTable
              props={[
                {
                  name: "geometry",
                  type: "BufferGeometry | null",
                  desc: "Custom particle geometry. Switches from sprite to instanced mesh mode.",
                },
                {
                  name: "lighting",
                  type: '"basic" | "standard" | "physical"',
                  default: '"standard"',
                  desc: '"basic" = unlit. "standard" = PBR (roughness/metalness). "physical" = full PBR (clearcoat, transmission, iridescence).',
                },
                {
                  name: "lightingParams",
                  type: "LightingParams | null",
                  desc: "PBR material parameters for standard/physical lighting.",
                },
                {
                  name: "shadow",
                  type: "boolean",
                  default: "false",
                  desc: "Enable shadow casting and receiving on geometry instances.",
                },
                {
                  name: "orientToDirection",
                  type: "boolean",
                  default: "false",
                  desc: "Rotate geometry to face velocity direction.",
                },
                {
                  name: "orientAxis",
                  type: "string",
                  default: '"z"',
                  desc: 'Which local axis aligns with velocity: "x", "y", "z", "-x", "-y", "-z".',
                },
                {
                  name: "stretchBySpeed",
                  type: "StretchConfig | null",
                  desc: "Stretch geometry along velocity direction based on speed.",
                },
              ]}
            />

            <Code filename="types.ts" caption="LightingParams interface">
              {`interface LightingParams {
  // Standard + Physical
  roughness?: number          // 0 = mirror, 1 = matte
  metalness?: number          // 0 = dielectric, 1 = metal
  emissive?: string           // Emissive color hex string
  emissiveIntensity?: number  // Emissive brightness
  envMapIntensity?: number    // Environment map strength

  // Physical only
  clearcoat?: number          // Clearcoat layer intensity
  clearcoatRoughness?: number // Clearcoat roughness
  transmission?: number       // Glass-like transparency
  thickness?: number          // Volume thickness for transmission
  ior?: number                // Index of refraction
  iridescence?: number        // Iridescence effect intensity
  iridescenceIOR?: number     // Iridescence index of refraction
}

interface StretchConfig {
  factor: number      // Stretch multiplier
  maxStretch: number  // Maximum stretch amount
}`}
            </Code>

            <Code filename="geometry.tsx" caption="3D debris with PBR lighting">
              {`import { BoxGeometry, SphereGeometry } from "three/webgpu"

// 3D debris with shadows
<VFXParticles
  geometry={new BoxGeometry(1, 1, 1)}
  maxParticles={500}
  size={[0.1, 0.2]}
  colorStart={["#ff00ff", "#aa00ff"]}
  gravity={[0, -2, 0]}
  lifetime={[1, 2]}
  rotation={[
    [0, Math.PI * 2],
    [0, Math.PI * 2],
    [0, Math.PI * 2],
  ]}
  shadow={true}
  lighting="standard"
/>

// Gem-like particles with physical material
<VFXParticles
  geometry={gemGeometry}
  lighting="physical"
  lightingParams={{
    roughness: 0.3,
    metalness: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.5,
  }}
/>

// Stretched sparks aligned to velocity
<VFXParticles
  geometry={new SphereGeometry(0.3, 8, 6)}
  orientToDirection={true}
  orientAxis="z"
  stretchBySpeed={{ factor: 2, maxStretch: 5 }}
  speed={[1, 5]}
/>`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Tip</span>
              <p>
                Use{" "}
                <code className="doc-inline-code">orientToDirection</code> with{" "}
                <code className="doc-inline-code">stretchBySpeed</code> on
                custom geometry for convincing sparks, debris, and projectile
                trails. The{" "}
                <code className="doc-inline-code">orientAxis</code> controls
                which local axis points along velocity.
              </p>
            </div>
          </section>

          {/* ===== SORTING ===== */}
          <section id="sorting">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Sorting</h2>
            </div>
            <p className="docs-p">
              Enable back-to-front depth sorting for correct alpha blending
              with transparent particles. On WebGPU, sorting uses a GPU bitonic
              sort. On WebGL fallback, it uses a CPU radix sort.
            </p>

            <PropTable
              props={[
                {
                  name: "sortParticles",
                  type: "boolean",
                  default: "false",
                  desc: "Enable depth sorting. Required for correct transparency with normal blending.",
                },
                {
                  name: "sortFrameInterval",
                  type: "number | null",
                  default: "null (auto)",
                  desc: "Run GPU sort every N frames (WebGPU only). 1 = every frame, 2 = every other frame. null = automatic.",
                },
              ]}
            />

            <Code filename="sorting.tsx">
              {`// Sorted transparent particles
<VFXParticles
  sortParticles
  sortFrameInterval={2}  // sort every other frame for better perf
  blending={1}           // normal blending (needs sorting)
  colorStart={["#ffffff80"]}
  fadeOpacity={[0.8, 0]}
/>`}
            </Code>

            <div className="docs-callout">
              <span className="docs-callout-label">Note</span>
              <p>
                Sorting is only needed with non-additive blending modes.
                Additive blending is order-independent and doesn't require
                sorting. Use{" "}
                <code className="doc-inline-code">sortFrameInterval</code> to
                trade accuracy for performance when you have many particles.
              </p>
            </div>
          </section>

          {/* ===== SOFT PARTICLES ===== */}
          <section id="soft-particles">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Soft Particles</h2>
            </div>
            <p className="docs-p">
              Soft particles fade out as they approach scene geometry, removing
              hard edges where particles intersect surfaces. This uses depth
              buffer comparison in the fragment shader.
            </p>

            <PropTable
              props={[
                {
                  name: "softParticles",
                  type: "boolean",
                  default: "false",
                  desc: "Enable soft particle fading near geometry.",
                },
                {
                  name: "softDistance",
                  type: "number",
                  default: "0.5",
                  desc: "Fade distance in world units. Larger = softer blending.",
                },
              ]}
            />

            <Code filename="soft.tsx">
              {`// Smoke that blends smoothly with the ground
<VFXParticles
  softParticles
  softDistance={1.5}
  size={[0.5, 1]}
  colorStart={["#888888"]}
  fadeOpacity={[0.6, 0]}
  gravity={[0, 0.2, 0]}
  lifetime={[3, 5]}
/>`}
            </Code>
          </section>

          {/* ===== CUSTOM SHADERS ===== */}
          <section id="custom-shaders">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Custom Shaders (TSL)</h2>
            </div>
            <p className="docs-p">
              Inject custom Three Shading Language (TSL) nodes into the particle
              rendering pipeline. Six injection points give you full creative
              control. Each callback receives a{" "}
              <code className="doc-inline-code">ParticleData</code> object
              containing all per-particle data as TSL nodes.
            </p>

            <h3 className="docs-h3">Shader Injection Points</h3>
            <PropTable
              props={[
                {
                  name: "colorNode",
                  type: "(data, defaultColor) => vec4",
                  desc: "Override particle color and alpha. Receives particle data and the default computed color.",
                },
                {
                  name: "opacityNode",
                  type: "(data) => float",
                  desc: "Override opacity calculation.",
                },
                {
                  name: "geometryNode",
                  type: "(data, defaultPosition) => vec3",
                  desc: "Modify vertex positions per-frame in world space. Receives ParticleData and the default computed position (vec3). Return a new vec3 to deform, animate, or offset geometry vertices. Works with any custom geometry.",
                },
                {
                  name: "backdropNode",
                  type: "(data) => vec4",
                  desc: "Screen-space effects. Access the backbuffer for distortion, blur, refraction.",
                },
                {
                  name: "alphaTestNode",
                  type: "(data) => float",
                  desc: "Custom alpha test/discard threshold.",
                },
                {
                  name: "castShadowNode",
                  type: "(data) => any",
                  desc: "Custom shadow map output.",
                },
              ]}
            />

            <h3 className="docs-h3">ParticleData Object</h3>
            <p className="docs-p">
              Every shader callback receives a{" "}
              <code className="doc-inline-code">ParticleData</code> object.
              All fields are TSL nodes that you can use in shader expressions:
            </p>
            <Code filename="types.ts" caption="ParticleData fields">
              {`interface ParticleData {
  progress: Node       // float: 0 → 1 over lifetime (0 = birth, 1 = death)
  lifetime: Node       // float: 1 → 0 over lifetime (inverse of progress)
  position: Node       // vec3: world position
  velocity: Node       // vec3: current velocity
  size: Node           // float: current particle size
  rotation: Node       // vec3: current rotation (Euler)
  colorStart: Node     // vec3: start color (from colorStart array)
  colorEnd: Node       // vec3: end color (from colorEnd array)
  color: Node          // vec3: interpolated color (start → end by progress)
  intensifiedColor: Node // vec3: color × intensity multiplier
  shapeMask: Node      // float: alpha from appearance mode (gradient/circular)
  index: Node          // float: particle index in buffer
}`}
            </Code>

            <Code
              filename="shaders.tsx"
              caption="Expanding death ring with animated dissolve"
            >
              {`import { uv, vec2, vec4, float, step, color } from "three/tsl"

<VFXParticles
  geometry={new PlaneGeometry(1, 1)}
  size={5}
  emitCount={1}
  lifetime={0.3}
  rotation={[[-Math.PI/2, -Math.PI/2], [0,0], [0,0]]}

  // colorNode receives ParticleData + defaultColor
  colorNode={({ progress }) => {
    const dist = uv().mul(2).sub(1).length()
    const circle = step(dist, float(0.9))
    const innerCircle = float(
      float(1).add(progress)
    ).sub(dist).max(0)

    return vec4(
      color("#fc6717").mul(20),
      circle.sub(innerCircle)
    )
  }}
/>`}
            </Code>

            <h3 className="docs-h3">Fresnel Effect</h3>
            <Code
              filename="fresnel.tsx"
              caption="Rim-lit 3D particles using normalView"
            >
              {`import {
  dot, Fn, mix, normalView,
  positionViewDirection, pow, vec3
} from "three/tsl"

<VFXParticles
  geometry={new SphereGeometry(0.3, 16, 12)}
  size={0.1}
  orientToDirection={true}
  lighting="basic"

  // Fn(() => ...) wraps a pure TSL function (no ParticleData needed)
  colorNode={Fn(() => {
    const fresnel = pow(
      dot(normalView, positionViewDirection).oneMinus(),
      8,
    )
    return mix(vec3(2), vec3(0), fresnel)
  })}
/>`}
            </Code>

            <h3 className="docs-h3">Geometry Node (Vertex Deformation)</h3>
            <p className="docs-p">
              The <code className="doc-inline-code">geometryNode</code> callback
              lets you deform particle geometry vertices every frame using TSL.
              It receives <code className="doc-inline-code">ParticleData</code>{" "}
              (with <code className="doc-inline-code">progress</code>,{" "}
              <code className="doc-inline-code">lifetime</code>, etc.) and{" "}
              <code className="doc-inline-code">defaultPosition</code> (the
              current vertex position as a <code className="doc-inline-code">vec3</code>).
              Return a new <code className="doc-inline-code">vec3</code> to
              replace the vertex position. Use{" "}
              <code className="doc-inline-code">time</code> from{" "}
              <code className="doc-inline-code">{"\"three/tsl\""}</code> to
              animate over time and{" "}
              <code className="doc-inline-code">progress</code> to vary per
              particle age.
            </p>

            <Code
              filename="floating-crystals.tsx"
              caption="Sine-wave floating: offset Y based on time + particle progress"
            >
              {`import { vec3, sin, time } from "three/tsl"

<VFXParticles
  geometry={crystalGeometry}
  lighting="standard"
  size={[0.14, 0.3]}
  speed={[0.1, 0.9]}
  lifetime={[1, 1.8]}
  gravity={[0, 0.8, 0]}
  colorStart={['#66ccff', '#bffcff']}
  colorEnd={['#2244aa']}

  // Adds a sine-wave bob to each vertex's Y position
  // progress offsets each particle's phase so they don't bob in sync
  geometryNode={({ progress }, defaultPosition) =>
    defaultPosition.add(
      vec3(0, sin(time.mul(6).add(progress.mul(8))).mul(0.12), 0)
    )
  }
/>`}
            </Code>

            <Code
              filename="bending-ribbons.tsx"
              caption="Sine-bend along Z axis: warp X based on vertex Z position"
            >
              {`import { vec3, sin, time } from "three/tsl"

<VFXParticles
  geometry={ribbonGeometry}
  lighting="physical"
  lightingParams={{
    roughness: 0.3,
    metalness: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.5,
  }}
  size={[0.12, 0.24]}
  speed={[0.3, 0.9]}
  lifetime={[1, 1.8]}
  colorStart={['#ffb36b', '#ffe5b2']}
  colorEnd={['#d34f1f']}

  // Bends the ribbon along its Z axis using a sine wave
  // defaultPosition.z drives the wave spatially,
  // time animates it, progress offsets per particle
  geometryNode={({ progress }, defaultPosition) => {
    const bend = sin(
      defaultPosition.z.mul(5).add(time.mul(4)).add(progress.mul(6))
    ).mul(0.18)
    return vec3(
      defaultPosition.x.add(bend),
      defaultPosition.y,
      defaultPosition.z
    )
  }}
/>`}
            </Code>

            <div className="callout callout--tip">
              <strong>Tip:</strong> The{" "}
              <code className="doc-inline-code">defaultPosition</code> is
              already transformed to world space. Use{" "}
              <code className="doc-inline-code">.add()</code>,{" "}
              <code className="doc-inline-code">.mul()</code>, and other TSL
              operations to modify it. You can read individual components with{" "}
              <code className="doc-inline-code">.x</code>,{" "}
              <code className="doc-inline-code">.y</code>,{" "}
              <code className="doc-inline-code">.z</code> and construct a new
              vec3 from them.
            </div>

            <h3 className="docs-h3">Backdrop Distortion</h3>
            <Code
              filename="backdrop.tsx"
              caption="Screen-space chromatic aberration"
            >
              {`import { screenUV, viewportSharedTexture, vec2, vec4 } from "three/tsl"

<VFXParticles
  backdropNode={({ progress }) => {
    const vUv = screenUV
    const distortion = progress.mul(0.02)

    // Chromatic aberration: offset R and B channels
    const r = viewportSharedTexture(
      vUv.add(vec2(distortion, 0))
    ).r
    const g = viewportSharedTexture(vUv).g
    const b = viewportSharedTexture(
      vUv.sub(vec2(distortion, 0))
    ).b

    return vec4(r, g, b, 1.0)
  }}
/>`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Note</span>
              <p>
                Shader nodes can be passed as either a callback function{" "}
                <code className="doc-inline-code">
                  {"(data) => Node"}
                </code>{" "}
                or as a static TSL node. Use{" "}
                <code className="doc-inline-code">{"Fn(() => ...)"}</code> when you
                don't need particle data (e.g. pure geometry-based effects like
                fresnel). Use a callback when you need{" "}
                <code className="doc-inline-code">progress</code>,{" "}
                <code className="doc-inline-code">lifetime</code>,{" "}
                <code className="doc-inline-code">velocity</code>, etc.
              </p>
            </div>
          </section>

          {/* ===== RUNTIME OVERRIDES ===== */}
          <section id="runtime-overrides">
            <div className="docs-section-header">
              <span className="docs-section-label">Patterns</span>
              <h2 className="docs-section-title">Runtime Overrides</h2>
            </div>
            <p className="docs-p">
              The most powerful pattern in r3f-vfx.{" "}
              <code className="doc-inline-code">emit()</code> and{" "}
              <code className="doc-inline-code">spawn()</code> accept an
              overrides object that changes particle properties for that single
              emission — without modifying the base system. Any{" "}
              <code className="doc-inline-code">BaseParticleProps</code> field
              can be overridden.
            </p>

            <Code
              filename="overrides.tsx"
              caption="Dynamic direction per attack"
            >
              {`const { emit } = useVFXEmitter("sparks")

// Override direction based on game state
const direction = attackType === "right"
  ? [[1, 1], [0, 0], [0, 0]]
  : [[-1, -1], [0, 0], [0, 0]]

emit([x, y, z], 50, { direction })

// Override multiple properties at once
emit([x, y, z], 100, {
  colorStart: ["#ff0000"],
  speed: [2, 5],
  size: [0.1, 0.3],
  gravity: [0, -20, 0],
})`}
            </Code>

            <Code
              filename="per-frame-overrides.tsx"
              caption="Per-frame emission with dynamic overrides"
            >
              {`useFrame((_, delta) => {
  if (isAttacking) {
    const direction = nextAttack === "ATTACK_02"
      ? [[1, 1], [-1, -1], [0, 0]]
      : [[-1, -1], [-1, -1], [0, 0]]

    sparkEmitterRef.current?.emit({ direction })
  }
})`}
            </Code>

            <div className="docs-callout">
              <span className="docs-callout-label">Key Concept</span>
              <p>
                Overrides are per-emission, not permanent. The base
                VFXParticles config stays unchanged. This lets you reuse a
                single particle system for many different situations — different
                directions, colors, speeds — all at runtime without extra draw
                calls.
              </p>
            </div>
          </section>

          {/* ===== EVENT-DRIVEN ===== */}
          <section id="event-driven">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Event-Driven Emission</h2>
            </div>
            <p className="docs-p">
              Combine <code className="doc-inline-code">useVFXEmitter</code>{" "}
              with an event system for loosely-coupled particle triggering.
              Define particle systems once, trigger them from anywhere.
            </p>

            <Code filename="particles.tsx">
              {`// 1. Define all systems in a central component
const Particles = () => (
  <>
    <VFXParticles name="death" autoStart={false}
      maxParticles={100} emitCount={100}
      gravity={[0, -15, 0]} speed={[0, 4.47]}
      collision={{ plane: { y: -1 }, bounce: 0.47, friction: 0.41 }}
    />
    <VFXParticles name="death-ring" autoStart={false}
      geometry={new PlaneGeometry(1, 1)}
      size={5} emitCount={1} lifetime={0.3}
    />
    <EnemyDeathHandler />
  </>
)

// 2. Subscribe to events and emit
const EnemyDeathHandler = () => {
  const { emit } = useVFXEmitter("death")
  const { emit: emitRing } = useVFXEmitter("death-ring")

  useEffect(() => {
    const off = eventBus.on("enemy-dead", ({ x, y, z }) => {
      emit([x, y, z], 50)
      emitRing([x, y, z], 1)
    })
    return off
  }, [emit, emitRing])

  return null
}

// 3. Trigger from game logic
enemy.onDeath(() => {
  eventBus.emit("enemy-dead", enemy.position)
})`}
            </Code>
          </section>

          {/* ===== NAMED SYSTEMS ===== */}
          <section id="named-systems">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Named Systems</h2>
            </div>
            <p className="docs-p">
              The <code className="doc-inline-code">name</code> prop registers
              a particle system in a global Zustand store. This enables three
              patterns:
            </p>

            <Code filename="named-systems.tsx">
              {`// Pattern 1: VFXEmitter links by name
<VFXParticles name="sparks" ... />
<VFXEmitter name="sparks" emitCount={4} />

// Pattern 2: Hook access by name
const { emit, stop } = useVFXEmitter("sparks")

// Pattern 3: Store access outside React
const store = useVFXStore.getState()
store.emit("sparks", { x: 0, y: 1, z: 0, count: 20 })

// Pattern 4: Type-safe particle registry
const PARTICLES = {
  SLASH: "slash",
  SPARKS: "sparks",
  DODGE: "dodge",
  IMPACT: "impact",
  DEATH: "death",
} as const

type ParticleType = typeof PARTICLES[keyof typeof PARTICLES]

const useTypedEmitter = (name: ParticleType) => {
  return useVFXEmitter(name)
}`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Architecture</span>
              <p>
                Keep all VFXParticles definitions in a single{" "}
                <code className="doc-inline-code">{"<Particles />"}</code>{" "}
                component at the root of your scene. Scatter VFXEmitters on
                objects that need them. Use{" "}
                <code className="doc-inline-code">useVFXEmitter</code> hooks in
                game logic. This separation keeps particle config centralized
                while allowing emission from anywhere — with zero extra draw
                calls per emitter.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
