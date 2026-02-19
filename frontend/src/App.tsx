import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import "./App.css";
import { TripProvider } from "./context/TripContext";
import Landing from "./pages/Landing";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoutes";

function App() {
  return (
    <Routes>

      <Route element={<PublicRoute/>}>
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
  );
}

export default App;
