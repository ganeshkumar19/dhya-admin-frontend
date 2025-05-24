import axios from 'axios';
import { Farm, FarmForm } from '../types/farms';
import { AddNewPond } from '../types/ponds';
import { getAuthHeaders } from '../helpers/getAuthHeaders';

const API_URL = import.meta.env.VITE_API_URL;

interface PaginatedFarmResponse {
  farms: Farm[];
  pagination: {
    page: number;
    totalPages: number;
    limit: number;
    totalCount: number;
  };
}

export interface UpdateFarmPayload {
  farmSize: string;
  farmType: string;
  waterSrc: string;
}



export const fetchFarms = async (
  page = 1,
  filters: { farmSize?: string; farmType?: string; waterSrc?: string } = {}
): Promise<PaginatedFarmResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    if (filters.farmSize) params.append('farmSize', filters.farmSize);
    if (filters.farmType) params.append('farmType', filters.farmType);
    if (filters.waterSrc) params.append('waterSrc', filters.waterSrc);

    const response = await axios.get(`${API_URL}/api/farms?${params.toString()}`, getAuthHeaders());

    return {
      farms: response.data.data.farms,
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    console.error('❌ Failed to fetch farms:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farms');
  }
};

export const addFarm = async (data: { farm: FarmForm; pond: AddNewPond }) => {
  const payload = {
    name: data.farm.farmName,
    ownerId: data.farm.userId,
    farmSize: data.farm.farmSize,
    farmType: data.farm.farmType,
    waterSrc: data.farm.waterSource,
    location: data.farm.location,
    notes: data.farm.notes,
    address: data.farm.address,
    city: data.farm.city,
    state: data.farm.state,
    country: data.farm.country,
    pincode: data.farm.pincode,
    latitude: '0.0',
    longitude: '0.0',
    ponds: [
      {
        name: data.pond.pondName,
        size: data.pond.pondSize,
        species: data.pond.species,
        density: data.pond.stockingDensity,
      },
    ],
  };

  const response = await axios.post(`${API_URL}/api/farms`, payload, getAuthHeaders());
  return response.data;
};



export const fetchFarmTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/farm-types`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch farm types:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farm types');
  }
};

export const fetchFarmSizes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/farm-sizes`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch farm sizes:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching farm sizes');
  }
};

export const fetchWaterSources = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/config/water-sources`, getAuthHeaders());
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch water sources:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching water sources');
  }
};

export const addFarmType = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/config/farm-types`,
      {
        name,
        farmType: name.toLowerCase(),
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to add farm type:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding farm type');
  }
};

export const addFarmSize = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/config/farm-sizes`,
      { 
        name,
        sizeType: name.toLowerCase(),
       },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to add farm size:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding farm size');
  }
};

export const addWaterSource = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/config/water-sources`,
      { 
        name,
        srcType: name.toLowerCase()
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to add water source:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding water source');
  }
};

export const updateFarm = async (
  id: string,
  data: UpdateFarmPayload
) => {
  const res = await axios.put(
    `${API_URL}/api/farms/${id}`,
    data,
    getAuthHeaders()
  );
  return res.data;
};


