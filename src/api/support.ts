import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL;

export type SupportTicket = {
  id: number;
  ticketno: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  userId: string;
  farmId: string;
  pondId: string;
  deviceId: string;
  issue: string;
  resolution: string | null;
  screenshotUrl: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  farm: {
    id: string;
    name: string;
  };
  pond: {
    id: string;
    name: string;
  };
};

export interface severityPayload {
  id: number;
  name: string;
  severityType: string;
}

export interface statusPayload {
  id: number;
  name: string;
  statusType: string;
}

export interface CreateSupportPayload {
  userId: string;
  deviceId: string;
  issue: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}


const formatTicket = (raw: any) => ({
  id: raw.id,
  ticketNo: raw.ticketno,
  deviceId: raw.deviceId,
  createdAt:new Date(raw.createdAt).toLocaleString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  }), 
  issue: raw.issue,
  severity: raw.severity.charAt(0).toUpperCase() + raw.severity.slice(1).toLowerCase(),
  status: raw.status
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' '),
  resolution: raw.resolution || '',
  user: raw.user?.name || 'Unknown',
});


export const getAuthHeaders = () => {
  const accessToken =
    useAuthStore.getState().accessToken || localStorage.getItem('accessToken');
    console.log('acc', accessToken)
  if (!accessToken) {
    console.warn('🚫 No auth token found in store or localStorage');
  }
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

// 📡 Fetch all support tickets (admin endpoint)
export const fetchSupportTickets = async (
  page = 1,
  status?: string,
  severity?: string
): Promise<{
  tickets: ReturnType<typeof formatTicket>[];
  pagination: any;
}> => {
  const params = new URLSearchParams({ page: page.toString() });

  if (status) params.append('status', status);
  if (severity) params.append('severity', severity);

  try {
    const response = await axios.get(
      `${API_URL}/api/support?${params.toString()}`,
      getAuthHeaders()
    );

    const rawTickets = response.data.data.tickets;

    return {
      tickets: rawTickets.map(formatTicket),
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    console.error('❌ Failed to fetch support tickets:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching support tickets');
  }
};

export const createSupportTicket = async (payload: CreateSupportPayload) => {
  const response = await axios.post(`${API_URL}/api/support/`, payload, getAuthHeaders());
  return response.data;
};

export const updateSupportTicket = async (
  id: number,
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED',
  resolution: string
) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const body = { status, resolution };
  const res = await axios.put(
    `${API_URL}/api/support/${id}`,
    body,
    getAuthHeaders()
  );
  return res.data;
};

export const fetchSeverityTypes = async (): Promise<severityPayload[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/config/support-severity-types`,
      getAuthHeaders()
    );
    return response.data.data; // assuming shape: { success: true, data: [...] }
  } catch (error: any) {
    console.error('❌ Failed to fetch support severity types:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching support severity types');
  }
};

export const fetchStatusTypes = async (): Promise<statusPayload[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/config/support-status-types`,
      getAuthHeaders()
    );
    return response.data.data; // assuming shape: { success: true, data: [...] }
  } catch (error: any) {
    console.error('❌ Failed to fetch support status types:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching support status types');
  }
};