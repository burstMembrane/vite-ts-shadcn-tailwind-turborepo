import { createRoot } from "react-dom/client";
import React from "react";
import "@repo/ui/styles";
import "./index.css";
import { App } from "./App";
import { ThemeProvider } from "@repo/ui";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
