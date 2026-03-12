import axios, { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import { CONSTANTS } from "./constants";

const instance = axios.create({
  baseURL: CONSTANTS.API_ENDPOINT,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // for any other error, throw it
    return Promise.reject(error);
  }
);

// Update the RequestConfig interface to match Axios types
interface RequestConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void | number;
}

interface ApiError extends Error {
  response?: {
    data: {
      success?: boolean;
      message?: string;
      error?: string;
      errors?: Array<{
        instancePath: string;
        schemaPath: string;
        keyword: string;
        params: Record<string, unknown>;
        message: string;
      }>;
    };
  };
}

export const apiRequest = async <T>(config: RequestConfig): Promise<T> => {
  try {
    // Create a modified config that properly handles the progress callback
    const modifiedConfig = { ...config };
    
    if (config.onUploadProgress) {
      modifiedConfig.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        // Call the original handler and ignore its return value
        config.onUploadProgress?.(progressEvent);
      };
    }
    
    const response = await instance(modifiedConfig);
    return response.data;
  } catch (error) {
    const errorObj = error as ApiError;
    const message = errorObj.response?.data.message || errorObj.response?.data.error || "Something went wrong";
    const errorWithData = new Error(message) as ApiError;
    errorWithData.response = errorObj.response;
    throw errorWithData;
  }
};
