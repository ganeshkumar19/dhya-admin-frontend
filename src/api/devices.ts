import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';

const API_URL = import.meta.env.VITE_API_URL;

export type Device = {
  id: string;
  deviceId: string;
  type: string;
  farm: string;
  pond: string;
  owner: string;
  lastSeen: string;
};

export interface DeviceTypeOption {
  id: number;
  name: string;
  type: string;
}


type RawDevice = {
  deviceId: string;
  type: string;
  lastSyncedAt: string | null;
  pond?: {
    id: string;
    name: string;
    farmId: string;
  };
  user?: {
    id: string;
    name: string;
  };
};

export type InStockDevice = {
  id: string;
  deviceId: string;
  type: string;
  state: string;
  status: string;
};

interface PaginatedDeviceResponse {
  devices: Device[];
  pagination: {
    page: number;
    totalPages: number;
    limit: number;
    totalCount: number;
  };
}

interface PaginatedInStockDeviceResponse {
  devices: InStockDevice[];
  pagination: {
    page: number;
    totalPages: number;
    limit: number;
    totalCount: number;
  };
}

const formatDevice = (raw: RawDevice): Device => ({
  id: raw.deviceId,
  deviceId: raw.deviceId,
  type: raw.type,
  farm: raw.pond?.farmId || 'N/A',
  pond: raw.pond?.name || 'N/A',
  owner: raw.user?.name || 'N/A',
  lastSeen: raw.lastSyncedAt
    ? new Date(raw.lastSyncedAt).toLocaleString()
    : 'Never',
});

const formatInStockDevice = (raw: any): InStockDevice => ({
  id: raw.id,
  deviceId: raw.deviceId,
  type: raw.type,
  state: raw.state,
  status: raw.status,
});



// 📡 Fetch all devices (admin endpoint)
export const fetchDevices = async (page = 1): Promise<PaginatedDeviceResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/devices?page=${page}&notState=INSTOCK`,
      getAuthHeaders()
    );
  

    console.log('status', response.data.data.devices)

    const rawDevices: RawDevice[] = response.data.data.devices;

    return {
      devices: rawDevices.map(formatDevice),
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    console.error('❌ Failed to fetch devices:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching devices');
  }
};

export const fetchInStockDevices = async (
  page = 1,
  type?: string,
  status?: string
): Promise<PaginatedInStockDeviceResponse> => {
  try {
    let url = `${API_URL}/api/admin/devices?state=INSTOCK&page=${page}`;

    if (type) {
      url += `&type=${type}`;
    }
    if (status) {
      url += `&status=${status}`;
    }

    const response = await axios.get(url, getAuthHeaders());

    const rawDevices = response.data.data.devices;

    return {
      devices: rawDevices.map(formatInStockDevice),
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    console.error('❌ Failed to fetch in-stock devices:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching in-stock devices');
  }
};

export const addNewDevice = async ({
  deviceId,
  type,
  firmwareVersion,
  location,
}: {
  deviceId: string;
  type: string;
  firmwareVersion: string;
  location: string;
}): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/api/admin/devices/`,
      {
        deviceId,
        type,
        firmwareVersion,
        location,
      },
      getAuthHeaders()
    );
  } catch (error: any) {
    console.error('❌ Failed to add device:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding device');
  }
};

export const fetchDeviceTypes = async (): Promise<DeviceTypeOption[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/config/device-types`,
      getAuthHeaders()
    );
    return response.data.data; // assuming shape: { success: true, data: [...] }
  } catch (error: any) {
    console.error('❌ Failed to fetch device types:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching device types');
  }
};

export const assignDevice = async (
  deviceId: string,
  userId: string,
  farmId: string,
  pondId: string
) => {
  const response = await axios.post(
    `${API_URL}/api/admin/devices/${deviceId}/assign`,
    {
      userId,
      farmId,
      pondId,
    },
    getAuthHeaders()
  );

  return response.data;
};
