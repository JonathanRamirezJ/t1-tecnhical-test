// Configuración de la API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Tipos para las respuestas de la API
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

// Función helper para hacer peticiones HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autorización si existe
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

// Función para obtener el token de autenticación
function getAuthToken(): string | null {
  // En producción, esto podría venir de cookies seguras o sessionStorage
  // Por ahora retornamos null ya que no usamos localStorage
  return null;
}

// API de autenticación
export const authAPI = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // SIMULACIÓN - En producción sería una llamada real al backend
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
        error: 'Credenciales inválidas',
      };
    }

    // EN PRODUCCIÓN sería algo como:
    // return apiRequest<AuthResponse>('/auth/login', {
    //     method: 'POST',
    //     body: JSON.stringify(credentials),
    // });
  },

  // Registro
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    // SIMULACIÓN - En producción sería una llamada real al backend
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

    // EN PRODUCCIÓN sería algo como:
    // return apiRequest<AuthResponse>('/auth/register', {
    //     method: 'POST',
    //     body: JSON.stringify(userData),
    // });
  },

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    // SIMULACIÓN - En producción sería una llamada real al backend
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
    };

    // EN PRODUCCIÓN sería algo como:
    // return apiRequest<void>('/auth/logout', {
    //     method: 'POST',
    // });
  },

  // Verificar token
  async verifyToken(token: string): Promise<ApiResponse<User>> {
    // SIMULACIÓN - En producción sería una llamada real al backend
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
        error: 'Token inválido',
      };
    }

    // EN PRODUCCIÓN sería algo como:
    // return apiRequest<User>('/auth/verify', {
    //     method: 'GET',
    // });
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    // SIMULACIÓN - En producción sería una llamada real al backend
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: false,
      error: 'Refresh token no implementado en simulación',
    };

    // EN PRODUCCIÓN sería algo como:
    // return apiRequest<AuthResponse>('/auth/refresh', {
    //     method: 'POST',
    // });
  },
};

// Otras APIs que podrías necesitar
export const userAPI = {
  // Obtener perfil del usuario
  async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/user/profile');
  },

  // Actualizar perfil
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
