import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { domAnimation, LazyMotion } from "motion/react";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/fraunces/wght-italic.css";
import App from "./App";
import { NotFoundPage } from "./components/NotFoundPage";
import "./styles.css";
import "./visual-refinements.css";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const isKnownEntry = pathname === "/" || pathname === "/index.html";

createRoot(document.getElementById("root")!).render(
  <LazyMotion features={domAnimation} strict>
    <StrictMode>
      {isKnownEntry ? <App /> : <NotFoundPage />}
    </StrictMode>
  </LazyMotion>,
);
