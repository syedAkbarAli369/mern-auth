import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

const backendURL = import.meta.env.VITE_BACKEND_URL;

// ✅ create axios instance (BEST PRACTICE)
const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export const AppContextProvider = (props) => {

  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      console.log("FINAL URL:", backendURL + "/api/auth/is-authenticated");

      const { data } = await api.post("/api/auth/is-authenticated");

      if (data.success) {
        setIsLogged(true);
        await getUserData();
      } else {
        setIsLogged(false);
      }

    } catch (error) {
      console.error("Auth Error:", error.response?.data || error.message);
      setIsLogged(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await api.get("/api/user/data");

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("User Data Error:", error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendURL,
    isLogged,
    setIsLogged,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};