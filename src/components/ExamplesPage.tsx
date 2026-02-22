import { useRef, useEffect } from "react";
import gsap from "gsap";

const EXAMPLES = [
  {
    title: "Caps Wars",
    subtitle: "3D Action Game",
    description:
      "Real-time combat with slash trails, spark bursts, death explosions, dodge afterimages, and expanding death rings. Every VFX effect uses r3f-vfx — from the backdrop distortion on sword swings to the bouncing debris on enemy kills.",
    image: "/capswars.png",
    url: "https://caps-wars.vercel.app/",
    github: "https://github.com/mustache-dev/caps-wars",
    features: [
      "Slash trails with fragmentColorFn",
      "Backdrop distortion shaders",
      "Runtime overrides per attack",
      "Event-driven death particles",
      "Collision bounce physics",
      "Multiple emitters, shared systems",
    ],
  },
  {
    title: "Spaceship",
    subtitle: "Flight Simulator",
    description:
      "A third-person spaceship combat demo featuring engine exhaust trails, laser beam effects, damage particles, and high-speed projectile VFX. Built with r3f-vfx for all real-time particle effects in the scene.",
    image: "/spaceship.png",
    url: "https://spaceship-blush.vercel.app/",
    features: [
      "Engine exhaust trails",
      "Laser beam particles",
      "Impact spark bursts",
      "Damage smoke & debris",
      "Turret muzzle flash",
      "Trail-based projectiles",
    ],
  },
];

export const ExamplesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".examples-hero-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".examples-hero-subtitle", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.from(".example-card", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="examples-page">
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

      {/* Hero */}
      <div className="examples-hero">
        <div className="examples-hero-inner">
          <span className="examples-hero-label">Showcase</span>
          <h1 className="examples-hero-title">
            Built with <span className="examples-hero-accent">r3f-vfx</span>
          </h1>
          <p className="examples-hero-subtitle">
            Real projects powered by GPU-accelerated particles. Every effect you
            see — trails, explosions, sparks, distortion — runs on Three VFX.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="examples-grid">
        {EXAMPLES.map((example) => (
          <div key={example.title} className="example-card">
            <a
              href={example.url}
              target="_blank"
              rel="noreferrer"
              className="example-card-image-wrap"
            >
              <img
                src={example.image}
                alt={example.title}
                className="example-card-image"
              />
              <div className="example-card-image-overlay" />
              <span className="example-card-play">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Demo
              </span>
            </a>

            <div className="example-card-body">
              <div className="example-card-header">
                <span className="example-card-subtitle">
                  {example.subtitle}
                </span>
                <h2 className="example-card-title">{example.title}</h2>
              </div>

              <p className="example-card-description">{example.description}</p>

              <div className="example-card-features">
                <span className="example-card-features-label">
                  VFX Features
                </span>
                <div className="example-card-tags">
                  {example.features.map((f) => (
                    <span key={f} className="example-card-tag">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="example-card-footer">
                <a
                  href={example.url}
                  target="_blank"
                  rel="noreferrer"
                  className="example-card-link"
                >
                  Open Live Demo
                  <span className="example-card-arrow">&#8599;</span>
                </a>
                {example.github && (
                  <a
                    href={example.github}
                    target="_blank"
                    rel="noreferrer"
                    className="example-card-link example-card-link--github"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Source Code
                    <span className="example-card-arrow">&#8599;</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="examples-cta">
        <p className="examples-cta-text">
          Building something with r3f-vfx? Share it on{" "}
          <a
            href="https://github.com/mustache-dev/Three-VFX"
            target="_blank"
            rel="noreferrer"
            className="examples-cta-link"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};
