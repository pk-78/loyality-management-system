import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login-page";
import AdminUserManagement from "./components/admin-user-management-revised-v2";
import PatientPointsManagement from "./components/patient-points-management-revised";
import PatientSearchAndManagement from "./components/patient-search-and-management-revised";
import { Toaster } from "react-hot-toast";
import PrivateRoutes from "./services/PrivateRoute";
import { useState } from "react";

function App() {
  const [isUsername, setIsUsername] = useState("");
 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage setIsUsername={setIsUsername}  />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage setIsUsername={setIsUsername}  />
            }
          />
          <Route
            path="/user-management"
            element={
              // <PrivateRoutes>
              <AdminUserManagement />
            }
          />
          <Route
            path="/patient-point/:id"
            element={
              // <PrivateRoutes>
              <PatientPointsManagement  isUsername={isUsername} />
              // </PrivateRoutes>
            }
          />
          <Route
            path="/patient-search"
            element={
              // <PrivateRoutes>
              <PatientSearchAndManagement />
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
