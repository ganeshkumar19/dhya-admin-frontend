import { useAuthStore } from '../store/useAuthStore';

export const getAuthHeaders = () => {
  const accessToken =
    useAuthStore.getState().accessToken || localStorage.getItem('accessToken');
  if (!accessToken) {
    console.warn('🚫 No auth token found in store or localStorage');
  }
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};