import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Lights } from "./components/lights";
import { OrbitControls } from "@react-three/drei";
import { PostProcessing } from "./components/postprocessing";
import { HomePage } from "./components/HomePage";
import { DocsPage } from "./components/DocsPage";

import { HeroScene } from "./components/scenes/HeroScene";

type Page = "home" | "docs";

function App() {
  const [page, setPage] = useState<Page>(() => {
    return window.location.hash === "#/docs" ? "docs" : "home";
  });

  useEffect(() => {
    const onHash = () => {
      setPage(window.location.hash === "#/docs" ? "docs" : "home");
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
            {/*<Model />*/}
            {ready && <HeroScene />}
            <OrbitControls enableZoom={false} enablePan={false} />
            <PostProcessing />
          </Canvas>
        </div>
      )}
      {page === "home" && <HomePage />}
      {page === "docs" && <DocsPage />}
    </>
  );
}

export default App;
