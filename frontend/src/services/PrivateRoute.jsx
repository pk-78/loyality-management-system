import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const LoginPrivateRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData")) || null;

  if (!userData) {
    return children;
  }

 

  if (userData && userData.role === "Staff") {
    return <Navigate to="/patient-search" />;
  }



  return children;
};

export default LoginPrivateRoute;
