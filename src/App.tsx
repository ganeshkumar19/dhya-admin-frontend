import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';
import { fetchLocation } from './api/location';
import { useLocationStore } from './store/useLocationStore';

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);
  const setLocationData = useLocationStore((state) => state.setLocationData);

  useEffect(() => {
    const refreshAccessToken = async () => {

      if (!refreshToken) return;

      try {
        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);
      } catch (error) {
        console.error('Failed to refresh token', error);
        logout();
      }
    };

    const getLocation = async () => {
      const location = await fetchLocation();
      if (location) {
        setLocationData(location)
      }
    };

    getLocation();


    refreshAccessToken();
  }, []);

  return <AppRoutes />;
}

export default App;
