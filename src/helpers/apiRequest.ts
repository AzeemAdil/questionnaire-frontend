import { AuthSuccessResponse, GenericData } from "@/interfaces";
import axios, { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import { CONSTANTS } from "./constants";

const instance = axios.create({
  baseURL: CONSTANTS.API_ENDPOINT,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.data.Msg === "jwt expired" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<
          GenericData<AuthSuccessResponse>
        >(`${CONSTANTS.API_ENDPOINT}/auth/login/refresh-token`, {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        // if token API returns new token
        if (refreshResponse.status === 200) {
          // save new token to localStorage
          localStorage.setItem(
            "@access-token",
            refreshResponse.data.data.accessToken
          );
          localStorage.setItem(
            "@refresh-token",
            refreshResponse.data.data.refreshToken
          );

          // update authorization header with new token
          originalRequest.headers["access-token"] =
            refreshResponse.data.data.accessToken;

          // retry original request with new token
          return instance(originalRequest);
        } else {
          // token API failed to return new token
          throw new Error("Failed to refresh token");
        }
      } catch (error) {
        // token API call failed
        // throw new Error("Failed to refresh token", error);
        console.log(error);
      }
    }

    if (error.response.data.Msg === "invalid token") {
    }

    // for any other error, throw it
    return Promise.reject(error);
  }
);

// Update the RequestConfig interface to match Axios types
interface RequestConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void | number;
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
    const errorObj = error as {
      response?: {
        data: {
          message?: string;
          error?: string;
        };
      };
    };
    throw new Error(
      errorObj.response?.data.message ||
        errorObj.response?.data.error ||
        "Something went wrong"
    );
  }
};
