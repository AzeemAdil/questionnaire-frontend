import axios, { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import { CONSTANTS } from "./constants";

const instance = axios.create({
  baseURL: CONSTANTS.API_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface RequestConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void | number;
}

export const apiRequest = async <T>(config: RequestConfig): Promise<T> => {
  try {
    const modifiedConfig = { ...config };
    if (config.onUploadProgress) {
      modifiedConfig.onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        config.onUploadProgress?.(progressEvent);
      };
    }
    const response = await instance(modifiedConfig);
    return response.data;
  } catch (error) {
    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
          msg?: string;
        };
      };
    };
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data?.msg ||
      "Something went wrong";
    throw new Error(message);
  }
};
