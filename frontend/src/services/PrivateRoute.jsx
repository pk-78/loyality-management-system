import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { url } from "./Url";

const PrivateRoutes = ({ children }) => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticate(false);
        } else {
          const res = await axios.get(`${url}/api/v1/user/verifytoken`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAuthenticate(res.data.success);
        }
      } catch (error) {
        setIsAuthenticate(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Please Wait .....</div>; // Consider a better loading UI
  }

  return isAuthenticate ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
