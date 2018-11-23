import axios, { AxiosInstance } from 'axios';

export function getApiClient (baseUrl: string): AxiosInstance {
  return axios.create({
    baseURL: `${baseUrl}/api`
  });
}