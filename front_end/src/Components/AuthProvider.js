import { jwtDecode } from "jwt-decode";
import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";

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

    if (!refreshToken) {
      logOut();
      return;
    }

    try {
      const response = await fetch(
        "https://myschool-ax55.onrender.com/api/user/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

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
    const response = await fetch(
      "https://myschool-ax55.onrender.com/api/user/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const res = await response.json();
    if (response.ok && res.access) {
      const decodedUser = jwtDecode(res.access);
      setUser(decodedUser);
      setToken(res.access);
      localStorage.setItem("sHule", res.access);
      localStorage.setItem("sHule_refresh", res.refresh);
      localStorage.setItem("sHule_user", JSON.stringify(decodedUser));

      navigate("/dashboard");
    } else {
      localStorage.setItem("sHule", "");
      throw new Error(res.detail);
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
    if (token && isTokenExpired(token)) {
      await refreshToken();
    }
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
