import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EmitterShapesScene } from "./scenes/EmitterShapesScene";
import { PhysicsScene } from "./scenes/PhysicsScene";
import { AttractorsScene } from "./scenes/AttractorsScene";
import { CustomShadersScene } from "./scenes/CustomShadersScene";
import { TrailsScene } from "./scenes/TrailsScene";
import { FlipbookScene } from "./scenes/FlipbookScene";
import { FlameScene } from "./scenes/FlameScene";
import { FresnelScene } from "./scenes/FresnelScene";

gsap.registerPlugin(ScrollTrigger);

const CODE_EXAMPLE = `import { VFXParticles } from "r3f-vfx"

<Canvas>
  <VFXParticles
    debug
  />
</Canvas>`;

const FEATURES_DATA = [
  {
    id: "emitter-shapes",
    num: "01",
    title: "Emitter Shapes",
    subtitle: "Spawn from anywhere",
    description:
      "Six built-in emitter shapes — point, box, sphere, cone, disk, and edge. Control radius, angle, height and direction to sculpt the perfect particle source for any effect.",
    props: ["emitterShape", "emitterRadius", "emitterAngle", "emitterHeight"],
    scene: EmitterShapesScene,
  },
  {
    id: "physics",
    num: "02",
    title: "Physics & Collisions",
    subtitle: "Real forces, GPU-driven",
    description:
      "Gravity, turbulence via curl noise, friction with easing, and plane collisions with bounce. All computed on the GPU through WebGPU compute shaders with automatic WebGL CPU fallback.",
    props: ["gravity", "turbulence", "friction", "collision"],
    scene: PhysicsScene,
  },
  {
    id: "attractors",
    num: "03",
    title: "Attractors & Vortices",
    subtitle: "Magnetic particle control",
    description:
      "Up to 4 simultaneous attractors per system. Point attractors pull particles inward, vortex attractors spin them around an axis. Control strength and radius for precise force fields.",
    props: ["attractors", "attractToCenter", "strength", "radius"],
    scene: AttractorsScene,
  },
  {
    id: "shaders",
    num: "04",
    title: "Custom Shaders",
    subtitle: "TSL node injection",
    description:
      "Inject custom Three Shading Language nodes into the particle pipeline. Override color, opacity, geometry, and backdrop with your own shader logic. Full creative control.",
    props: ["colorNodes", "opacityNodes", "geometryNodes", "backdropNodes"],
    scene: CustomShadersScene,
  },
  {
    id: "trails",
    num: "05",
    title: "Trail Rendering",
    subtitle: "History-based particle trails",
    description:
      "Meshline-based trails that follow particle history. Control segment count, width, taper, and length. Combine with velocity curves for dynamic spark effects that arc and fade naturally.",
    props: ["trail", "velocityCurve", "showParticles", "segments"],
    scene: TrailsScene,
  },
  {
    id: "flipbook",
    num: "06",
    title: "Flipbook & Textures",
    subtitle: "Sprite sheet animation",
    description:
      "Use texture alpha maps and colorNode injection to create fire, smoke, and explosion sprites. Combine multiple particle layers — texture sprites with ember particles — for rich, layered effects.",
    props: ["colorNode", "texture", "alphaMap", "blending"],
    scene: FlipbookScene,
  },
  {
    id: "flame",
    num: "07",
    title: "Layered Effects",
    subtitle: "Multi-emitter composition",
    description:
      "Combine multiple VFXParticles with different geometries, blending modes, and turbulence settings. Layer texture-based sprites over stretched sphere particles with additive blending for realistic fire.",
    props: ["stretchBySpeed", "turbulence", "blending", "geometry"],
    scene: FlameScene,
  },
  {
    id: "fresnel",
    num: "08",
    title: "Fresnel & Geometry",
    subtitle: "Custom mesh particles",
    description:
      "Replace default billboards with custom Three.js geometries. Apply fresnel-based colorNode shaders for rim lighting effects. Stretch particles by velocity for dramatic motion trails.",
    props: ["colorNode", "geometry", "orientToDirection", "stretchBySpeed"],
    scene: FresnelScene,
  },
];

export const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ===== Hero entrance timeline =====
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      tl.from(navRef.current!.children, {
        y: -40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
      });

      tl.from(
        cornerTLRef.current,
        { x: -60, y: -60, opacity: 0, duration: 1.2 },
        0.1,
      );

      tl.from(
        cornerBRRef.current,
        { x: 60, y: 60, opacity: 0, duration: 1.2 },
        0.1,
      );

      tl.from(
        titleRef.current,
        { y: 120, opacity: 0, duration: 1.4, ease: "power3.out" },
        0.2,
      );

      tl.from(subtitleRef.current, { y: 40, opacity: 0, duration: 1 }, 0.6);

      tl.from(taglineRef.current, { x: -80, opacity: 0, duration: 1 }, 0.7);

      tl.from(
        ctaRef.current!.children,
        { y: 30, opacity: 0, duration: 0.8, stagger: 0.12 },
        0.9,
      );

      tl.from(scrollIndicatorRef.current, { opacity: 0, duration: 1 }, 1.2);

      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2,
      });

      // ===== Intro section =====
      if (introRef.current) {
        const introChildren = introRef.current.querySelectorAll(".intro-line");
        gsap.from(introChildren, {
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          y: 60,
          opacity: 0,
          stagger: 0.15,
        });
      }

      // ===== Code block =====
      if (codeRef.current) {
        gsap.from(codeRef.current, {
          scrollTrigger: {
            trigger: codeRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          scale: 0.95,
        });
      }

      // ===== Feature sections =====
      sectionRefs.current.forEach((section) => {
        if (!section) return;

        const num = section.querySelector(".feature-num");
        const title = section.querySelector(".feature-title");
        const subtitle = section.querySelector(".feature-subtitle");
        const description = section.querySelector(".feature-description");
        const props = section.querySelector(".feature-props");
        const scene = section.querySelector(".feature-scene");
        const divider = section.querySelector(".feature-divider-line");

        const featureTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 20%",
            scrub: 1,
          },
        });

        if (divider) {
          featureTl.from(divider, { scaleX: 0, duration: 1 }, 0);
        }

        if (num) {
          featureTl.from(num, { x: -40, opacity: 0, duration: 0.8 }, 0.1);
        }

        if (title) {
          featureTl.from(
            title,
            { y: 60, opacity: 0, duration: 1, ease: "power3.out" },
            0.15,
          );
        }

        if (subtitle) {
          featureTl.from(subtitle, { y: 30, opacity: 0, duration: 0.8 }, 0.3);
        }

        if (description) {
          featureTl.from(
            description,
            { y: 30, opacity: 0, duration: 0.8 },
            0.4,
          );
        }

        if (props) {
          featureTl.from(
            props.children,
            { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 },
            0.5,
          );
        }

        if (scene) {
          featureTl.from(scene, { opacity: 0, scale: 0.9, duration: 1.2 }, 0.2);
        }
      });

      // ===== Capabilities grid =====
      if (capabilitiesRef.current) {
        const items =
          capabilitiesRef.current.querySelectorAll(".capability-item");
        gsap.from(items, {
          scrollTrigger: {
            trigger: capabilitiesRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          y: 50,
          opacity: 0,
          stagger: 0.1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="homepage">
      {/* ===== NAV (fixed) ===== */}
      <nav ref={navRef} className="nav">
        <div className="nav-logo">
          <span className="nav-logo-bracket">[</span>
          r3f-vfx
          <span className="nav-logo-bracket">]</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">
            Features
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

      {/* ===== HERO (first viewport) ===== */}
      <section className="hero-section">
        {/* Corner decorations */}
        <div ref={cornerTLRef} className="corner corner--tl">
          <div className="corner-line corner-line--h" />
          <div className="corner-line corner-line--v" />
        </div>
        <div ref={cornerBRRef} className="corner corner--br">
          <div className="corner-line corner-line--h" />
          <div className="corner-line corner-line--v" />
        </div>

        <div className="hero">
          <div className="hero-content">
            <div ref={taglineRef} className="tagline">
              <span className="tagline-line" />
              <span className="tagline-text">React Three Fiber</span>
            </div>

            <h1 ref={titleRef} className="hero-title">
              <span className="hero-title-line">Visual</span>
              <span className="hero-title-line hero-title-line--italic">
                Effects
              </span>
            </h1>

            <p ref={subtitleRef} className="hero-subtitle">
              GPU-accelerated particle systems, shaders, and post-processing
              <br />
              for your React Three Fiber scenes. Built for WebGPU.
            </p>

            <div ref={ctaRef} className="hero-cta">
              <a href="#get-started" className="btn btn--primary">
                <span className="btn-text">Get Started</span>
                <span className="btn-arrow">&#8594;</span>
              </a>
              <a href="#examples" className="btn btn--outline">
                <span className="btn-text">See Examples</span>
              </a>
              <span className="hero-version">v0.0.1</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bottom-bar">
          <div className="bottom-bar-left">
            <span className="mono-sm">WebGPU</span>
            <span className="mono-sm mono-sm--dim">/</span>
            <span className="mono-sm">WebGL</span>
            <span className="mono-sm mono-sm--dim">/</span>
            <span className="mono-sm">TSL</span>
          </div>
          <div ref={scrollIndicatorRef} className="scroll-indicator">
            <span className="scroll-indicator-text">Scroll</span>
            <svg
              width="16"
              height="24"
              viewBox="0 0 16 24"
              fill="none"
              className="scroll-indicator-icon"
            >
              <rect
                x="1"
                y="1"
                width="14"
                height="22"
                rx="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="8" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="bottom-bar-right">
            <span className="mono-sm">npm i r3f-vfx</span>
          </div>
        </div>
      </section>

      {/* ===== INTRO SECTION ===== */}
      <section className="section section--intro">
        <div ref={introRef} className="intro-content">
          <p className="intro-line intro-line--large">
            Drop-in particle effects
          </p>
          <p className="intro-line intro-line--large intro-line--dim">
            for the React ecosystem.
          </p>
          <p className="intro-line intro-line--body">
            r3f-vfx gives you a declarative, component-based API for creating
            complex GPU-driven particle systems. No shader knowledge required —
            but full TSL shader injection when you need it.
          </p>
        </div>
      </section>

      {/* ===== CODE EXAMPLE ===== */}
      <section className="section section--code">
        <div ref={codeRef} className="code-block">
          <div className="code-header">
            <div className="code-dots">
              <span className="code-dot" />
              <span className="code-dot" />
              <span className="code-dot" />
            </div>
            <span className="code-filename">scene.tsx</span>
          </div>
          <pre className="code-content">
            <code>{CODE_EXAMPLE}</code>
          </pre>
          <div className="code-footer">
            <span className="code-footer-text">That's it. Really.</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURE SECTIONS ===== */}
      <div id="features">
        {FEATURES_DATA.map((feature, i) => {
          const SceneComponent = feature.scene;
          return (
            <section
              key={feature.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className={`section section--feature ${i % 2 !== 0 ? "section--feature-reverse" : ""}`}
            >
              <div className="feature-divider">
                <div className="feature-divider-line" />
              </div>

              <div className="feature-grid">
                <div className="feature-info">
                  <span className="feature-num">{feature.num}</span>
                  <h2 className="feature-title">{feature.title}</h2>
                  <p className="feature-subtitle">{feature.subtitle}</p>
                  <p className="feature-description">{feature.description}</p>
                  <div className="feature-props">
                    {feature.props.map((prop) => (
                      <span key={prop} className="feature-prop">
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="feature-scene">
                  <SceneComponent />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ===== CAPABILITIES GRID ===== */}
      <section className="section section--capabilities">
        <div className="section-header">
          <span className="section-header-line" />
          <span className="section-header-label">Full Feature Set</span>
        </div>
        <h2 className="section-title">Everything you need</h2>

        <div ref={capabilitiesRef} className="capabilities-grid">
          {[
            {
              title: "6 Emitter Shapes",
              desc: "Point, box, sphere, cone, disk, edge",
            },
            {
              title: "GPU Compute",
              desc: "WebGPU shaders with WebGL CPU fallback",
            },
            {
              title: "Physics System",
              desc: "Gravity, turbulence, friction, collisions",
            },
            {
              title: "Bezier Curves",
              desc: "Animate size, opacity, velocity over lifetime",
            },
            {
              title: "4 Attractors",
              desc: "Point and vortex force fields per system",
            },
            {
              title: "Trail Rendering",
              desc: "Meshline-based trails with custom width/opacity",
            },
            {
              title: "Custom TSL Shaders",
              desc: "Inject nodes for color, opacity, geometry",
            },
            {
              title: "PBR Lighting",
              desc: "Basic, standard, and physical lighting models",
            },
            {
              title: "Soft Particles",
              desc: "Depth-aware blending for seamless integration",
            },
            {
              title: "Flipbook Animation",
              desc: "Sprite sheet support with rows/columns config",
            },
            {
              title: "Debug Panel",
              desc: "Interactive prop tweaking with code generation",
            },
            {
              title: "Multi-Framework",
              desc: "React, Vue, Svelte, and vanilla Three.js",
            },
          ].map((cap) => (
            <div key={cap.title} className="capability-item">
              <h3 className="capability-title">{cap.title}</h3>
              <p className="capability-desc">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="section section--footer-cta">
        <div className="footer-cta-content">
          <h2 className="footer-cta-title">
            Start building
            <span className="footer-cta-title--italic"> effects</span>
          </h2>
          <div className="footer-cta-install">
            <span className="footer-cta-prompt">$</span>
            <span className="footer-cta-cmd">npm install r3f-vfx</span>
          </div>
          <div className="footer-cta-links">
            <a href="#/docs" className="btn btn--primary">
              <span className="btn-text">Documentation</span>
              <span className="btn-arrow">&#8594;</span>
            </a>
            <a
              href="https://github.com/mustache-dev/Three-VFX"
              className="btn btn--outline"
              target="_blank"
              rel="noreferrer"
            >
              <span className="btn-text">View on GitHub</span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="mono-sm">
            Built for React Three Fiber &amp; Three.js
          </span>
          <span className="mono-sm mono-sm--dim">MIT License</span>
        </div>
      </section>
    </div>
  );
};
