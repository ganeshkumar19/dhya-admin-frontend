import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';
const API_URL = import.meta.env.VITE_API_URL;


export const fetchRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/role-types`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch farm sizes:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farm sizes');
  }
};

export const addRoles = async (roleType: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/config/role-types`,
      {
        roleType: roleType.toUpperCase(),
        description: roleType.toLowerCase(),
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to add role:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding role');
  }
};