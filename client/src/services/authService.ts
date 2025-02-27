import { REACT_APP_API_URL, api } from "./config";
import { SignupResponseType, UserType, LoginData, LoginResponseType, UserResponseType } from "../types/entityTypes";
import { AxiosError } from 'axios';

const AUTH_API_URL = `${REACT_APP_API_URL}/auth`;

/**
 * Signup service
 * @param data  User data
 * @returns     SignupResponseType
 */
const signup = async (data: UserType): Promise<SignupResponseType> => {
  try {
    const response = await api.post<SignupResponseType>(`${AUTH_API_URL}/signup`, data);

    if (response.status === 200 && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error((error as Error).message || "An unexpected error occurred");
  }
};

/**
 * Login service
 * @param data  User data
 * @returns     LoginResponseType
 */

const login = async (data: LoginData): Promise<LoginResponseType> => {
  try {
    const response = await api.post<LoginResponseType>(`${AUTH_API_URL}/login`, data);

    if (response.status === 200 && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      }
      else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error((error as Error).message || 'An unexpected error occurred');
  }
};

/**
 * Get current user service
 * @param token  User token
 * @returns      UserResponseType
 */
const getCurrentUser = async (token: string): Promise<UserResponseType | null> => {
  try {
    const response = await api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('getCurrentUser response from service:', response.data);
    if (response.data.success) {
      return response.data.user as UserResponseType;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};


export { signup, login, getCurrentUser };
