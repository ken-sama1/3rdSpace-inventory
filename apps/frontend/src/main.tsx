import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AuthProvider from "./context/AuthProvider.tsx";
import ToastProvider from "./context/ToastProvider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const root = document.getElementById("root");

if (root)
  createRoot(root).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  );
