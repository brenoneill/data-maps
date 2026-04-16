import React from "react";
import ReactDOM from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import { AlertProvider } from "@/context/AlertContext";
import { SlideoutProvider } from "@/context/SlideoutContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NuqsAdapter>
      <AlertProvider>
        <SlideoutProvider>
          <App />
        </SlideoutProvider>
      </AlertProvider>
    </NuqsAdapter>
  </React.StrictMode>
);
