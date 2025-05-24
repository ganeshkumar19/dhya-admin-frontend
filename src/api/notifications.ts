import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';
const API_URL = import.meta.env.VITE_API_URL;



export const fetchNotifications = async (page = 1) => {
  const response = await axios.get(`${API_URL}/api/notifications?page=${page}`, getAuthHeaders());
  return response.data.data; // includes notifications, total, pagination
};
