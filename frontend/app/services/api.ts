import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
} from './api.types';

// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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

    // El backend devuelve { status: 'success', data: {...}, message: '...', token?: '...' }
    if (data.status === 'success') {
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        token: data.token, // Pasar el token si existe
      };
    } else {
      return {
        success: false,
        error: data.message || 'Error desconocido',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Function to get authentication token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Function to set authentication token
function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    console.log(
      'API: Token guardado en localStorage:',
      token.substring(0, 20) + '...'
    );
  } else {
    console.log('API: No se puede guardar token - window no disponible');
  }
}

// Function to remove authentication token
function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// Authentication API
export const authAPI = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('API Login: Respuesta completa del backend:', response);

    if (response.success && response.data) {
      console.log('API Login: Respuesta completa:', response);
      console.log('API Login: Datos recibidos:', response.data);

      // El backend devuelve { status: 'success', token: '...', data: { user: {...} } }
      const authData: AuthResponse = {
        user: response.data.user,
        token: response.token!, // El token ahora viene en response.token
      };

      // Guardar el token
      if (authData.token) {
        console.log(
          'API Login: Guardando token:',
          authData.token.substring(0, 20) + '...'
        );
        setAuthToken(authData.token);

        // Verificar inmediatamente que se guardó
        const verificacion = localStorage.getItem('auth_token');
        console.log(
          'API Login: Token verificado en localStorage:',
          verificacion ? 'Guardado correctamente' : 'ERROR - No se guardó'
        );
      } else {
        console.log('API Login: ERROR - No hay token en la respuesta');
      }

      return {
        success: true,
        data: authData,
        message: response.message,
      };
    }

    console.log('API Login: ERROR - Respuesta no exitosa:', response);
    return response;
  },

  // Register
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      // El backend devuelve { status: 'success', token: '...', data: { user: {...} } }
      const authData: AuthResponse = {
        user: response.data.user,
        token: response.token!, // El token viene en response.token
      };

      // Guardar el token
      if (authData.token) {
        console.log('API Register: Guardando token...');
        setAuthToken(authData.token);
      }

      return {
        success: true,
        data: authData,
        message: response.message,
      };
    }

    return response;
  },

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    // Verificar que tenemos un token antes de hacer la petición
    const token = getAuthToken();
    if (!token) {
      // Si no hay token, simplemente limpiamos el localStorage
      removeAuthToken();
      return {
        success: true,
        message: 'Sesión cerrada exitosamente',
      };
    }

    const response = await apiRequest<void>('/auth/logout', {
      method: 'POST',
    });

    // Siempre remover el token del localStorage, independientemente del resultado
    removeAuthToken();

    return response;
  },

  // Verify token / Get current user
  async getMe(): Promise<ApiResponse<User>> {
    const response = await apiRequest<any>('/auth/me', {
      method: 'GET',
    });

    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.user,
        message: response.message,
      };
    }

    return response;
  },

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return apiRequest<void>('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
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
