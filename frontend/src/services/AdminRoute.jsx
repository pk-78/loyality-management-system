import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  //   localStorage.setItem("role", user.role);
  const userRole = localStorage.getItem("role") || {};
  //   console.log(userRole, "ye le");

  if (!userRole) {
    return children;
  }

  if (userRole === "Staff") {
    return <Navigate to="/user-management" />;
  }

  return children;
};

export default AdminRoute;
