import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "../src/pages/Home";
import "./App.css";
import { TripProvider } from "./context/TripContext";
import Landing from "./pages/Landing";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoutes";
import { useEffect } from "react";
import axios from "axios";
import Footer from "./components/UI/Footer";

function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { status, data } = error.response || {};
        const message = (data?.message || error.message || "").toLowerCase();

        const shouldLogout =
          localStorage.getItem("token") &&
          (status === 401 ||
            message.includes("jwt expired") ||
            message.includes("token expired"));

        if (shouldLogout) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.replace("/");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className={`flex-1 `}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/home"
              element={
                <TripProvider>
                  <Home />
                </TripProvider>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer fixed={isLanding} />
    </div>
  );
}

export default App;
