import { useState } from "react";
import LoginPage from "./components/login-page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminUserManagement from "./components/admin-user-management-revised-v2";
import PatientPointsManagement from "./components/patient-points-management-revised";
import PatientSearchAndManagement from "./components/patient-search-and-management-revised";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user-management" element={<AdminUserManagement />} />

          <Route path="/patient-point" element={<PatientPointsManagement />} />
          <Route
            path="/patient-search"
            element={<PatientSearchAndManagement />}
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
