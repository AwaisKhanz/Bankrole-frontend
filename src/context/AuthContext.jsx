import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { showErrorToast, showSuccessToast } from "../utils/toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true); // Tracks if user data is being fetched
  const navigate = useNavigate();

  // Fetch user profile if a token exists
  useEffect(() => {
    if (token) {
      fetchUserProfile()
        .catch((error) => {
          showErrorToast("Session expired. Please log in again.");
          logOut();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginAction = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const { token: authToken } = response.data;

      // Save token and fetch user profile
      localStorage.setItem("token", authToken);
      setToken(authToken);
      await fetchUserProfile();

      showSuccessToast("Login successful!");
      navigate("/");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error.response?.data?.message || "Login failed.";
    }
  };

  const registerAction = async (data) => {
    try {
      await api.post("/auth/register", data);
      showSuccessToast("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      showErrorToast(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      throw error.response?.data?.message || "Registration failed.";
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data?.user);
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch user profile.";
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loginAction,
        registerAction,
        fetchUserProfile,
        logOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
