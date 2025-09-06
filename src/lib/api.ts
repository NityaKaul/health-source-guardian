// API configuration and helper functions
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend.vercel.app' 
  : 'http://localhost:5000';

// Store JWT token
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// API request helper with auth headers
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
};

// Auth API functions
export const signup = async (userData: { name: string; email: string; password: string }) => {
  const result = await apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (result.token) {
    setAuthToken(result.token);
  }
  
  return result;
};

export const login = async (credentials: { email: string; password: string }) => {
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (result.token) {
    setAuthToken(result.token);
  }
  
  return result;
};

export const resetPassword = async (email: string) => {
  return apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// Case API functions
export const submitCase = async (caseData: {
  patientName: string;
  age: number;
  gender: string;
  symptoms: string[];
  waterSource: string;
  location: string;
  notes?: string;
}) => {
  return apiRequest('/api/cases', {
    method: 'POST',
    body: JSON.stringify(caseData),
  });
};

export const getCases = async () => {
  return apiRequest('/api/cases');
};

// Water test API functions
export const submitWaterTest = async (testData: {
  location: string;
  turbidity: number;
  ph: number;
  temperature?: number;
  bacterialTest?: string;
  notes?: string;
}) => {
  return apiRequest('/api/water-tests', {
    method: 'POST',
    body: JSON.stringify(testData),
  });
};

export const getWaterTests = async () => {
  return apiRequest('/api/water-tests');
};

// Alerts API functions
export const getAlerts = async () => {
  return apiRequest('/api/alerts');
};

export const createAlert = async (alertData: {
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}) => {
  return apiRequest('/api/alerts', {
    method: 'POST',
    body: JSON.stringify(alertData),
  });
};

// Image upload function
export const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const token = getAuthToken();
  
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/upload-image`, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};