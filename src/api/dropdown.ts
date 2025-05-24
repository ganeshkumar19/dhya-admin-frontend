import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';

const API_URL = import.meta.env.VITE_API_URL;


export const fetchAllFarms = async () => {
  console.log('farms')
  const response = await axios.get(`${API_URL}/api/farms/all`, getAuthHeaders())
  console.log('response', response.data);
  return response.data.data; // assuming response structure is { success, data }
};

export const fetchAllUsers = async () => {
  const response = await axios.get(`${API_URL}/api/users/all`, getAuthHeaders());
  return response.data.data; // assuming response structure is { success, data }
};

export const fetchAllDevices = async () => {
  const response = await axios.get(`${API_URL}/api/admin/devices/all`, getAuthHeaders());
  console.log('response', response)
  return response.data.data;
};

export const fetchAllPonds = async () => {
  const response = await axios.get(`${API_URL}/api/ponds/all`, getAuthHeaders());
  return response.data.data;
};

export const fetchPondsByFarmId = async (farmId: string) => {
  const response = await axios.get(
    `${API_URL}/api/ponds/all?farmId=${farmId}`,
    getAuthHeaders()
  );
  return response.data.data;
};



export const fetchFarmsByUserId = async (userId: string) => {
  const response = await axios.get(
    `${API_URL}/api/farms/all?ownerId=${userId}`,
    getAuthHeaders()
  );
  return response.data.data;
};

