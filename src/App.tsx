import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Lights } from "./components/lights";
import { OrbitControls } from "@react-three/drei";
import { PostProcessing } from "./components/postprocessing";
import { HomePage } from "./components/HomePage";
import { DocsPage } from "./components/DocsPage";
import { ExamplesPage } from "./components/ExamplesPage";
import { StorePage } from "./components/StorePage";
import { HeroScene } from "./components/scenes/HeroScene";

type Page = "home" | "docs" | "examples" | "store";

function getPage(): Page {
  const hash = window.location.hash;
  if (hash === "#/docs") return "docs";
  if (hash === "#/examples") return "examples";
  if (hash === "#/store") return "store";
  return "home";
}

function App() {
  const [page, setPage] = useState<Page>(getPage);

  useEffect(() => {
    const onHash = () => {
      setPage(getPage());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready) {
      setTimeout(() => {
        setReady(true);
      }, 500);
    }
  }, []);

  return (
    <>
      {page === "home" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
          }}
        >
          <Canvas renderer={{ forceWebGL: false }} hmr={true}>
            <Lights />
            {ready && <HeroScene />}
            <OrbitControls enableZoom={false} enablePan={false} />
            <PostProcessing />
          </Canvas>
        </div>
      )}
      {page === "home" && <HomePage />}
      {page === "docs" && <DocsPage />}
      {page === "examples" && <ExamplesPage />}
      {page === "store" && <StorePage />}
    </>
  );
}

export default App;
