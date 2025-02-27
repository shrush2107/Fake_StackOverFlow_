import axios, { AxiosError, AxiosResponse } from "axios";

const REACT_APP_API_URL: string = process.env.CLIENT_URL || 'http://localhost:8000';


/**
 * Handles the response from the API
 * @param res   The response from the API
 * @returns   The response from the API
 */
const handleRes = (res: AxiosResponse): AxiosResponse => {
  return res;
};

/**
 * Handles the error from the API
 * @param err   The error from the API
 * @returns   The error from the API
 */
const handleErr = (err: AxiosError): Promise<never> => {
  console.error(err);
  return Promise.reject(err);
};

/**
 * The Axios instance to be used for the API
 */
const api = axios.create({
  baseURL: REACT_APP_API_URL,
  // Removed withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    // Attach the token to every request if available
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => handleErr(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => handleRes(response),
  (error: AxiosError): Promise<never> => handleErr(error)
);

export { REACT_APP_API_URL, api };
