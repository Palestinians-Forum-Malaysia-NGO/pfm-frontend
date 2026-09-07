import { useLocation } from "react-router-dom";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PageTransition({ children }) {
  const { key } = useLocation();
  return (
    <div key={key} className={reduced() ? "" : "animate-page-enter"}>
      {children}
    </div>
  );
}
