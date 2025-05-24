import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';

const API_URL = import.meta.env.VITE_API_URL;

export type Pond = {
  id: string;
  name: string;
  size: string;
  density: number;
  species: string;
  lastFeed: string;
  avgWeight: number;
  growthRate: number;
  feedToday: number;
  fcr: number;
  daysInCycle: number;
  totalStock: number;
  do_mg_l: number;
  temp_c: number;
  ph: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  salinity: number;
  turbidity: number;
  tds: number;
  orp: number;
  chlorine: number;
  water_level: number;
  farmId: string;
  createdAt: string;
  updatedAt: string;
  farm: {
    id: string;
    name: string;
    location: string;
    ownerId: string;
  };
};

interface PaginatedPondResponse {
  ponds: Pond[];
  pagination: {
    page: number;
    totalPages: number;
    limit: number;
    totalCount: number;
  };
}

export type CreatePondPayload = {
  name: string;
  size: string;
  density: number;
  species: string;
  farmId: string;
};




export const fetchPonds = async (
  page = 1,
  filters: { size?: string; species?: string } = {}
): Promise<PaginatedPondResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    if (filters.size) params.append('size', filters.size);
    if (filters.species) params.append('species', filters.species);

    const response = await axios.get(`${API_URL}/api/ponds?${params.toString()}`, getAuthHeaders());

    return {
      ponds: response.data.data.ponds,
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    console.error('❌ Failed to fetch ponds:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching ponds');
  }
};


export const fetchPondSizes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/pond-sizes`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch farm types:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farm types');
  }
};

export const fetchPondSpecies = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/species`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch farm sizes:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farm sizes');
  }
};

export const addPondSize = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/config/pond-sizes`,
      { 
        name,
        sizeType: name.toLowerCase()
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to add pond size:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding pond size');
  }
};

export const addPondSpecies = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/config/species`,
      { 
        name,
        speciesType: name.toLowerCase()
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to add pond species:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding pond species');
  }
};


export const addPond = async (data: CreatePondPayload) => {
  const response = await axios.post(`${API_URL}/api/ponds/`, data, getAuthHeaders());
  return response.data;
};

export const updatePond = async (id: string, data: {
  name: string;
  size: string;
  density: number;
  species: string;
}) => {
  const response = await axios.put(
    `${API_URL}/api/ponds/${id}`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

