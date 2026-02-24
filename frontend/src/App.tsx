import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import "./App.css";
import { TripProvider } from "./context/TripContext";
import Landing from "./pages/Landing";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoutes";
import { useEffect } from "react";
import axios from "axios";

function App() {
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
    <Routes>

      <Route element={<PublicRoute/>}>
         <Route path="/" element={<Landing />} />
      </Route>


      //UNCOMMENT THIS VERY VERY IMPORTANT
      <Route element={<ProtectedRoute />}>
      {/* <Route> */}
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
  );
}

export default App;
