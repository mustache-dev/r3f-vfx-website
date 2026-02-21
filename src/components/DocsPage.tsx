import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ===== Sidebar navigation data ===== */
const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
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
    items: [{ id: "use-vfx-emitter", label: "useVFXEmitter" }],
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
}) => (
  <div className="doc-code">
    {filename && (
      <div className="doc-code-header">
        <div className="code-dots">
          <span className="code-dot" />
          <span className="code-dot" />
          <span className="code-dot" />
        </div>
        <span className="code-filename">{filename}</span>
      </div>
    )}
    <pre className="doc-code-content">
      <code>{children}</code>
    </pre>
    {caption && (
      <div className="doc-code-caption">
        <span>{caption}</span>
      </div>
    )}
  </div>
);

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
      // Entrance animation
      gsap.from(".docs-content section", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".docs-sidebar", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.1,
      });
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
              r3f-vfx requires React Three Fiber v9+ and Three.js 0.182+. It
              works with both WebGPU and WebGL renderers, falling back to CPU
              computation when WebGPU is not available.
            </p>
            <Code filename="terminal">
              {`npm install r3f-vfx

# peer dependencies
npm install three @react-three/fiber @react-three/drei`}
            </Code>
            <div className="docs-callout">
              <span className="docs-callout-label">Note</span>
              <p>
                For trail effects, also install{" "}
                <code className="doc-inline-code">makio-meshline</code> as a
                peer dependency.
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
              setup, no boilerplate.
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
              That's it. The particle system is self-contained — it manages its
              own GPU buffers, emission timing, and rendering. Drop it into any
              R3F scene.
            </p>
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
              material, and emission logic.
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
  appearance={"gradient"}
  blending={"additive"}
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
                  desc: "Register the system in the VFX store. Required for VFXEmitter linking.",
                },
                {
                  name: "maxParticles",
                  type: "number",
                  default: "10000",
                  desc: "Maximum particle buffer capacity.",
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
                  desc: "Particles spawned per emission cycle.",
                },
                {
                  name: "delay",
                  type: "number",
                  desc: "Delay in seconds before first emission.",
                },
                {
                  name: "debug",
                  type: "boolean",
                  default: "false",
                  desc: "Show interactive debug panel for tweaking props.",
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
                  desc: "Starting color(s). Random pick per particle.",
                },
                {
                  name: "colorEnd",
                  type: "string[] | null",
                  desc: "Ending color(s) to lerp toward over lifetime.",
                },
                {
                  name: "fadeOpacity",
                  type: "[start, end]",
                  default: "[1, 0]",
                  desc: "Opacity fade over lifetime.",
                },
                {
                  name: "fadeSize",
                  type: "[start, end]",
                  default: "[1, 0]",
                  desc: "Size scale over lifetime.",
                },
                {
                  name: "appearance",
                  type: '"default" | "gradient" | "circular"',
                  default: '"default"',
                  desc: "Visual style of particles.",
                },
                {
                  name: "blending",
                  type: '"normal" | "additive" | "multiply" | "subtractive"',
                  default: '"normal"',
                  desc: "Blend mode for rendering.",
                },
                {
                  name: "intensity",
                  type: "number",
                  default: "1",
                  desc: "Overall brightness multiplier.",
                },
                {
                  name: "lighting",
                  type: '"basic" | "standard" | "physical"',
                  default: '"standard"',
                  desc: "PBR lighting model.",
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
              single particle system.
            </p>

            <Code
              filename="PlayerController.tsx"
              caption="From caps-wars: dodge emitters attached to a player character"
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

            <PropTable
              props={[
                {
                  name: "name",
                  type: "string",
                  desc: "Name of the VFXParticles system to emit from.",
                },
                {
                  name: "particlesRef",
                  type: "Ref",
                  desc: "Direct ref to a VFXParticles (alternative to name).",
                },
                {
                  name: "position",
                  type: "[x, y, z]",
                  desc: "Local position offset for this emitter.",
                },
                {
                  name: "emitCount",
                  type: "number",
                  desc: "Particles per emission.",
                },
                {
                  name: "autoStart",
                  type: "boolean",
                  default: "true",
                  desc: "Begin emitting on mount.",
                },
                {
                  name: "loop",
                  type: "boolean",
                  desc: "Continuously loop emission.",
                },
                {
                  name: "localDirection",
                  type: "boolean",
                  desc: "Apply quaternion rotation to emission direction. Essential for moving objects.",
                },
                {
                  name: "delay",
                  type: "number",
                  desc: "Delay in seconds before first emission.",
                },
              ]}
            />
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
              handlers, or other non-component code.
            </p>

            <Code
              filename="enemyDeath.tsx"
              caption="Event-driven emission from caps-wars"
            >
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
                  type: "(pos?, count?, overrides?) => void",
                  desc: "Emit particles at a position with optional overrides.",
                },
                {
                  name: "burst",
                  type: "(pos?, count?, overrides?) => void",
                  desc: "One-shot burst emission.",
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
                  desc: "Kill all living particles.",
                },
                {
                  name: "isEmitting",
                  type: "() => boolean",
                  desc: "Check if currently emitting.",
                },
                {
                  name: "getUniforms",
                  type: "() => ParticleUniforms",
                  desc: "Access GPU uniform values.",
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
              rotation, and lighting. Most props accept ranges{" "}
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
  fadeOpacity={[1, 0]}        // fade out over lifetime

  // Rendering
  appearance={"circular"}     // "default" | "gradient" | "circular"
  blending={"additive"}       // glow effect
  lighting={"standard"}       // PBR lighting
  intensity={40}              // brightness multiplier

  // Rotation
  rotation={[[-3.4, 6.7], [-7.6, 6.7], [-5.4, 6.4]]}
  rotationSpeed={[[-6.3, 5.9], [-5.9, 6], [-6.6, 6]]}

  // Stretch along velocity
  orientToDirection={true}
  stretchBySpeed={{ factor: 2, maxStretch: 5 }}

  // Custom geometry instead of billboards
  geometry={new SphereGeometry(0.5, 16, 12)}
/>`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Tip</span>
              <p>
                Use <code className="doc-inline-code">orientToDirection</code>{" "}
                with{" "}
                <code className="doc-inline-code">stretchBySpeed</code> on
                custom geometry for convincing sparks and debris.
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
              cases:
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

            <Code filename="emitters.tsx">
              {`// Sphere surface emission (great for explosions)
<VFXParticles
  emitterShape={2}
  emitterRadius={0.3}
  emitterSurfaceOnly={true}    // only from sphere surface
  startPositionAsDirection={true}  // velocity = outward from center
/>

// Cone emission (fire, jet exhaust)
<VFXParticles
  emitterShape={3}
  emitterAngle={0.4}           // narrow cone
  emitterHeight={[0, 2.13]}
  emitterDirection={[0, 1, 0]} // emit upward
/>

// Circle surface (spawn rings, portals)
<VFXParticles
  emitterShape={4}
  emitterRadius={[0.5, 1]}
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
              to CPU computation.
            </p>

            <Code filename="physics.tsx">
              {`<VFXParticles
  // Velocity
  speed={[0, 4.47]}
  direction={[[-1, 1], [0, 1], [-1, 1]]}  // random 3D direction
  lifetime={[1, 3]}

  // Gravity: [x, y, z] vector
  gravity={[0, -15, 0]}       // strong downward pull

  // Turbulence (curl noise)
  turbulence={{
    intensity: 400,            // strength
    frequency: 2.7,            // noise scale
    speed: 1,                  // animation speed
  }}

  // Friction: slow particles over time
  friction={{
    intensity: 0.5,
    easing: "easeOut",         // "linear" | "easeIn" | "easeOut" | "easeInOut"
  }}
/>`}
            </Code>

            <PropTable
              props={[
                {
                  name: "speed",
                  type: "[min, max]",
                  default: "[0.1, 0.1]",
                  desc: "Initial velocity magnitude range.",
                },
                {
                  name: "direction",
                  type: "[[xMin,xMax],[yMin,yMax],[zMin,zMax]]",
                  desc: "Direction range per axis.",
                },
                {
                  name: "gravity",
                  type: "[x, y, z]",
                  default: "[0, 0, 0]",
                  desc: "Constant acceleration vector.",
                },
                {
                  name: "turbulence",
                  type: "{ intensity, frequency?, speed? }",
                  desc: "Curl noise disturbance.",
                },
                {
                  name: "friction",
                  type: "{ intensity, easing }",
                  desc: "Drag applied over lifetime.",
                },
                {
                  name: "lifetime",
                  type: "number | [min, max]",
                  default: "[1, 2]",
                  desc: "Particle lifespan in seconds.",
                },
              ]}
            />
          </section>

          {/* ===== ATTRACTORS ===== */}
          <section id="attractors">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Attractors</h2>
            </div>
            <p className="docs-p">
              Up to 4 attractors per particle system. Point attractors pull
              particles toward a position. Vortex attractors spin particles
              around an axis.
            </p>

            <Code filename="attractors.tsx">
              {`<VFXParticles
  attractors={[
    // Point attractor: pulls everything to center
    {
      position: [0, 0, 0],
      strength: 2,
      radius: 4,
      type: 0,              // 0 = POINT
    },
    // Vortex: swirls around Y axis
    {
      position: [0, 1, 0],
      strength: 3,
      radius: 5,
      type: 1,              // 1 = VORTEX
      axis: [0, 1, 0],      // spin axis
    },
  ]}

  // Shorthand: pull all particles toward emitter center
  attractToCenter={true}
/>`}
            </Code>
          </section>

          {/* ===== COLLISIONS ===== */}
          <section id="collisions">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Collisions</h2>
            </div>
            <p className="docs-p">
              Plane collision with configurable bounce, friction, and
              death-on-impact. Particles bounce off an infinite horizontal
              plane.
            </p>

            <Code
              filename="collision.tsx"
              caption="From caps-wars: death particles bouncing off the ground"
            >
              {`<VFXParticles
  gravity={[0, -15, 0]}
  speed={[0, 4.47]}
  lifetime={[1, 3]}
  appearance={"circular"}
  blending={"additive"}
  collision={{
    plane: -1,                 // Y position of the ground
    bounce: 0.47,              // energy retained on bounce
    friction: 0.41,            // horizontal slowdown on contact
    deathOnCollision: false,   // keep living after bounce
    adjustGravityBySize: 0,    // larger particles fall faster
  }}
/>`}
            </Code>

            <PropTable
              props={[
                {
                  name: "plane",
                  type: "number",
                  desc: "Y position of the collision plane.",
                },
                {
                  name: "bounce",
                  type: "number",
                  desc: "Bounce factor (0 = no bounce, 1 = perfect).",
                },
                {
                  name: "friction",
                  type: "number",
                  desc: "Horizontal friction on contact.",
                },
                {
                  name: "deathOnCollision",
                  type: "boolean",
                  desc: "Kill particle on first collision.",
                },
                {
                  name: "adjustGravityBySize",
                  type: "number",
                  desc: "Scale gravity by particle size.",
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
              velocity, and rotation change over a particle's lifetime. Define
              curves inline or load pre-baked{" "}
              <code className="doc-inline-code">.bin</code> files for complex
              animations.
            </p>

            <Code filename="curves.tsx">
              {`// Inline bezier curve for velocity
<VFXParticles
  velocityCurve={[
    { x: 0, y: 1 },                    // full speed at birth
    { x: 0.3, y: 0.8,                  // ease down
      handleLeft: [0.2, 0.9],
      handleRight: [0.4, 0.7] },
    { x: 1, y: 0 },                    // stop at death
  ]}
  fadeSizeCurve={[
    { x: 0, y: 0.2 },
    { x: 0.5, y: 1 },                  // peak at 50% life
    { x: 1, y: 0 },
  ]}
/>

// Pre-baked curve texture (from debug panel export)
<VFXParticles
  curveTexturePath="./vfx/impact.bin"
/>`}
            </Code>

            <div className="docs-callout docs-callout--tip">
              <span className="docs-callout-label">Tip</span>
              <p>
                Use{" "}
                <code className="doc-inline-code">{"debug={true}"}</code> on
                your VFXParticles to open the interactive debug panel. Tweak
                curves visually, then export to{" "}
                <code className="doc-inline-code">.bin</code> files.
              </p>
            </div>
          </section>

          {/* ===== TRAILS ===== */}
          <section id="trails">
            <div className="docs-section-header">
              <h2 className="docs-section-title">Trails</h2>
            </div>
            <p className="docs-p">
              Meshline-based trail rendering that follows each particle.
              Requires{" "}
              <code className="doc-inline-code">makio-meshline</code> as a peer
              dependency.
            </p>

            <Code filename="trails.tsx">
              {`<VFXParticles
  trail={{
    enabled: true,
    segments: 20,              // trail length
    width: (i) => 0.1 * (1 - i / 20),   // taper width
    opacity: (i) => 1 - i / 20,          // fade out
    color: (i) => new THREE.Color().lerpColors(
      new THREE.Color("#ff6b35"),
      new THREE.Color("#ff6b3500"),
      i / 20
    ),
  }}
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
              rendering pipeline. Four injection points give you full creative
              control.
            </p>

            <Code
              filename="shaders.tsx"
              caption="From caps-wars: expanding death ring with animated dissolve"
            >
              {`import { uv, vec2, vec4, float, step, color } from "three/tsl"

<VFXParticles
  geometry={new PlaneGeometry(1, 1)}
  size={5}
  emitCount={1}
  lifetime={0.3}
  rotation={[[-Math.PI/2, -Math.PI/2], [0,0], [0,0]]}

  // colorNode receives { progress } (0 to 1 over lifetime)
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

            <h3 className="docs-h3">Shader Injection Points</h3>
            <PropTable
              props={[
                {
                  name: "colorNodes",
                  type: "({ progress }) => vec4",
                  desc: "Override particle color and alpha. Receives normalized lifetime progress.",
                },
                {
                  name: "opacityNodes",
                  type: "({ progress }) => float",
                  desc: "Override opacity calculation.",
                },
                {
                  name: "geometryNodes",
                  type: "({ progress }) => vec3",
                  desc: "Modify vertex positions.",
                },
                {
                  name: "backdropNodes",
                  type: "({ progress }) => vec4",
                  desc: "Screen-space effects. Access the backbuffer for distortion, blur, etc.",
                },
              ]}
            />

            <Code
              filename="backdrop-distortion.tsx"
              caption="Screen-space chromatic aberration on slash effect"
            >
              {`import { screenUV, viewportSharedTexture, vec4 } from "three/tsl"

<VFXParticles
  backdropNode={({ progress }) => {
    const vUv = screenUV
    const distortion = progress.mul(0.02)

    // Chromatic aberration
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
          </section>

          {/* ===== RUNTIME OVERRIDES ===== */}
          <section id="runtime-overrides">
            <div className="docs-section-header">
              <span className="docs-section-label">Patterns</span>
              <h2 className="docs-section-title">Runtime Overrides</h2>
            </div>
            <p className="docs-p">
              The most powerful pattern in r3f-vfx.{" "}
              <code className="doc-inline-code">emit()</code> accepts an
              overrides object that changes particle properties for that single
              emission — without modifying the base system.
            </p>

            <Code
              filename="useCapsController.ts"
              caption="From caps-wars: flipping slash direction per attack"
            >
              {`const useCapsController = ({ slashEmitterRef, sparkEmitterRef }) => {
  const executeAttack = (attackName) => {
    // Override direction based on which attack animation plays
    const direction = attackName === "ATTACK_02"
      ? [[1, 1], [0, 0], [0, 0]]     // slash right
      : [[-1, -1], [0, 0], [0, 0]]   // slash left

    slashEmitterRef.current?.emit({ direction })
  }

  // Per-frame emission with dynamic overrides
  useFrame((_, delta) => {
    if (isAttacking) {
      const direction = nextAttack === "ATTACK_02"
        ? [[1, 1], [-1, -1], [0, 0]]
        : [[-1, -1], [-1, -1], [0, 0]]

      sparkEmitterRef.current?.emit({ direction })
    }
  })
}`}
            </Code>

            <div className="docs-callout">
              <span className="docs-callout-label">Key Concept</span>
              <p>
                Overrides are per-emission, not permanent. The base
                VFXParticles config stays unchanged. This lets you reuse a
                single particle system for many different situations — different
                directions, colors, speeds — all at runtime.
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
      collision={{ plane: -1, bounce: 0.47, friction: 0.41 }}
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

// Pattern 3: Type-safe particle registry
const PARTICLES = {
  SLASH: "slash",
  SPARKS: "sparks",
  DODGE: "dodge",
  IMPACT: "impact",
  DEATH: "death",
} as const

type ParticleType = typeof PARTICLES[keyof typeof PARTICLES]

// Wrap the hook for autocomplete
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
                while allowing emission from anywhere.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
