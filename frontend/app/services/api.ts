// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Helper function for HTTP requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if exists
  const token = getAuthToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Function to get authentication token
function getAuthToken(): string | null {
  // In production, this could come from secure cookies or sessionStorage
  // For now we return null since we don't use localStorage
  return null;
}

// Authentication API
export const authAPI = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // SIMULATION - In production, this would be a real call to the backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email && credentials.password.length >= 6) {
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
        },
        token: `fake-jwt-token-${Date.now()}`,
      };

      return {
        success: true,
        data: mockResponse,
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    // IN PRODUCTION would be something like:
    // return apiRequest<AuthResponse>('/auth/login', {
    //     method: 'POST',
    //     body: JSON.stringify(credentials),
    // });
  },

  // Register
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    // SIMULATION - In production, this would be a real call to the backend
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponse: AuthResponse = {
      user: {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.email.split('@')[0],
      },
      token: `fake-jwt-token-${Date.now()}`,
    };

    return {
      success: true,
      data: mockResponse,
    };

    // IN PRODUCTION would be something like:
    // return apiRequest<AuthResponse>('/auth/register', {
    //     method: 'POST',
    //     body: JSON.stringify(userData),
    // });
  },

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    // SIMULATION - In production, this would be a real call to the backend
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
    };

    // IN PRODUCTION would be something like:
    // return apiRequest<void>('/auth/logout', {
    //     method: 'POST',
    // });
  },

  // Verify token
  async verifyToken(token: string): Promise<ApiResponse<User>> {
    // SIMULATION - In production, this would be a real call to the backend
    await new Promise(resolve => setTimeout(resolve, 300));

    if (token.startsWith('fake-jwt-token-')) {
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'user',
        token: token,
      };

      return {
        success: true,
        data: mockUser,
      };
    } else {
      return {
        success: false,
        error: 'Invalid token',
      };
    }

    // IN PRODUCTION would be something like:
    // return apiRequest<User>('/auth/verify', {
    //     method: 'GET',
    // });
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    // SIMULATION - In production, this would be a real call to the backend
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: false,
      error: 'Refresh token not implemented in simulation',
    };

    // IN PRODUCTION would be something like:
    // return apiRequest<AuthResponse>('/auth/refresh', {
    //     method: 'POST',
    // });
  },
};

// Other APIs you might need
export const userAPI = {
  // Get user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/user/profile');
  },

  // Update profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

export default {
  auth: authAPI,
  user: userAPI,
};
