import axios from 'axios';
import { Member } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000 // 15 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      return Promise.reject(new Error(error.response.data.message || 'An error occurred'));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
      return Promise.reject(new Error('Server is not responding. Please check if the server is running.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// Check server health
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

export const getAllMembers = async (): Promise<Member[]> => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const getMemberById = async (id: string): Promise<Member> => {
  try {
    const response = await api.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
};

export const createMember = async (formData: FormData): Promise<Member> => {
  try {
    // Check server health first
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
      throw new Error('Server is not responding. Please try again later.');
    }

    // Validate form data
    const requiredFields = ['name', 'role', 'email', 'contact', 'image'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const response = await axios.post('http://localhost:5000/api/members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
      timeout: 30000, // 30 seconds timeout for file upload
      validateStatus: (status) => status >= 200 && status < 300
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create member');
      } else if (error.request) {
        throw new Error('Server is not responding. Please check if the server is running.');
      }
    }
    throw error;
  }
};

export default api;