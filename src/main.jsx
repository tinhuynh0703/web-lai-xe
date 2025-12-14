import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider, AuthProvider } from "./providers";
import { setupInterceptors } from "./lib/api";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";

// Setup API interceptors
setupInterceptors();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);
