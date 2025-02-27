import { jwtDecode } from "jwt-decode";
import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./apiservice";
import { toast } from "react-toastify";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("sHule_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("sHule") || "");
  const navigate = useNavigate();

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("sHule_refresh");
    console.log("refreshToken", refreshToken, 1111111111111111111);
    if (!refreshToken) {
      logOut();
      return;
    }

    try {
      const response = await fetch(`${API_URL}user/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const res = await response.json();

      if (response.ok) {
        setToken(res.access);
        localStorage.setItem("sHule", res.access);

        const decodedUser = jwtDecode(res.access);
        setUser(decodedUser);
        localStorage.setItem("sHule_user", JSON.stringify(decodedUser));
      } else {
        logOut();
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      logOut();
    }
  };

  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp < currentTime;
  };

  const loginAction = async (data) => {
    const response = await fetch(`${API_URL}user/login/admin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    console.log(API_URL, res)
    if (response.ok && res.access) {
      const decodedUser = jwtDecode(res.access);
      setUser(decodedUser);
      setToken(res.access);
      localStorage.setItem("sHule", res.access);
      localStorage.setItem("sHule_refresh", res.refresh);
      localStorage.setItem("sHule_user", JSON.stringify(decodedUser));
      toast.success("Login successful! Redirecting to dashboard...");

      navigate("/dashboard");
    } else {
      localStorage.setItem("sHule", "");
      console.log(res, res.message, 11111111111111111111111111111111)
      toast.error(res.message);
      throw new Error(res.message);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("sHule");
    localStorage.removeItem("sHule_refresh");
    localStorage.removeItem("sHule_user");
    navigate("/login");
  };

  // Middleware to check token validity before accessing any authenticated routes
  const checkTokenAndRefresh = async () => {
    const token = localStorage.getItem("sHule");
    console.log("Checking token and refreshing................", isTokenExpired(token));
    if (token && isTokenExpired(token)) {
      await refreshToken();
    }
    // navigate('/login')
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loginAction, logOut, checkTokenAndRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
