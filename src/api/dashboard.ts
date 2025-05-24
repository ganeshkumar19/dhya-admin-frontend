import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from './support';

const API_URL = import.meta.env.VITE_API_URL;

interface OverviewCountsResponse {
  farms: number;
  ponds: number;
  devices: number;
  users: number;
  tickets: number;
}

export const fetchOverviewCounts = async (): Promise<OverviewCountsResponse> => {
  try {
    const response = await axios.get<{ success: boolean; data: OverviewCountsResponse }>(
      `${API_URL}/api/config/overview-counts`,
      getAuthHeaders()
    );

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Unexpected API response format');
    }

    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error('Error fetching overview counts:', error);
    throw new Error(
      error?.response?.data?.message || error.message || 'Failed to fetch overview counts'
    );
  }
};