import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';
const API_URL = import.meta.env.VITE_API_URL;

export const fetchPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/plans`, getAuthHeaders());
    console.log('response', response)
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch plans:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farm sizes');
  }
};

export const addPlan = async (name: string) => {
  // Dummy function for now
  console.log('Adding plan:', name);
  return { success: true };
};

export const fetchSubscriptions = async () => {
  const response = await axios.get(`${API_URL}/api/subscriptions/
`, getAuthHeaders());
  return response.data.data.subscriptions;
};

export const createPlan = async (payload: {
  userId: string;
  planId: number;
  amount: number;
  startDate: string;
  endDate: string;
}) => {
  const response = await axios.post(`${API_URL}/api/subscriptions/`, payload, getAuthHeaders());
  return response.data;
};