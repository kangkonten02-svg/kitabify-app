import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme preference on load (default follows system)
const savedTheme = localStorage.getItem("kitabify_theme");
if (savedTheme === "light") {
  document.documentElement.classList.add("light");
} else if (!savedTheme) {
  // Follow system preference if no saved preference
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.classList.add("light");
  }
}

createRoot(document.getElementById("root")!).render(<App />);
