import { useRef, useEffect } from "react";
import gsap from "gsap";

export const StorePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".store-icon", {
        scale: 0.6,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2,
      });
      gsap.from(".store-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.4,
      });
      gsap.from(".store-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="store-page">
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

      <div className="store-coming-soon">
        <div className="store-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h1 className="store-title">Coming Soon</h1>
        <p className="store-subtitle">
          Premium VFX presets, templates, and ready-to-use particle effects.
          <br />
          Stay tuned.
        </p>
      </div>
    </div>
  );
};
