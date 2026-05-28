import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useUserStore } from '../store/userStore';

function getBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri;
  const host = hostUri?.split(':')?.[0];

  if (host) {
    return `http://${host}:8080`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  return 'http://localhost:8080';
}

export const BASE_URL = getBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useUserStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
