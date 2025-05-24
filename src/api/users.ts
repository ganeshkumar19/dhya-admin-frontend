import axios from 'axios';
import { getAuthHeaders } from '../helpers/getAuthHeaders';

const API_URL = import.meta.env.VITE_API_URL;

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  registrationStatus: string;
  mobile: string; // ✅ new field
};

// Raw user type based on your API response
type RawUser = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: { id: number; role: string }[];
  status: string;
  registrationStatus: string;
  phone: string; // ✅ include phone
};


interface PaginatedUserResponse {
  users: User[];
  pagination: {
    page: number;
    totalPages: number;
    limit: number;
    totalCount: number;
  };
}


// 🔐 Auth headers helper

// 🧠 Helper to format raw API users to UI users
const formatUser = (raw: RawUser): User => ({
  id: raw.id,
  name: raw.name,
  email: raw.email,
  role: raw.roles?.[0]?.role || 'unknown',
  status: raw.isActive ? 'Active' : 'Inactive',
  registrationStatus: raw.status ?? '--',
  mobile: raw.phone || '--', // ✅ map phone to mobile, fallback to '--' if missing
});


// 🚀 Fetch users from API and format them
export const fetchUsers = async (page = 1): Promise<PaginatedUserResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/users?page=${page}`, getAuthHeaders());
    const rawUsers: RawUser[] = response.data.data.users;

    console.log('rawusers', rawUsers)
    return {
      users: rawUsers.map(formatUser),
      pagination: response.data.data.pagination,
    };
  } catch (error: any) {
    console.error('❌ Failed to fetch users:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error fetching users');
  }
};
export const addUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/api/users`, userData, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to add user:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding user');
  }
};

export const completeUserRegistration = async (id: string, formData: any) => {
  try {
    const response = await axios.put(`${API_URL}/api/users/complete-register/${id}`, formData, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to add user:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Error adding user');
  }
};

export const searchUser = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/?search=${query}`, getAuthHeaders());
    const users = response.data?.data?.users;

    if (users && users.length > 0) {
      return users[0]; // return first matched user
    } else {
      throw new Error('No users found matching the query.');
    }
  } catch (error: any) {
    console.error('Error searching for user:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Failed to search user');
  }
};

