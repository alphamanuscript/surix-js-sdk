import axios, { AxiosInstance } from 'axios';

export function getApiClient (baseUrl: string, apiKey: string): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: baseUrl
  })
  axiosInstance.defaults.headers['Authorization'] = `apikey ${apiKey}`
  return axiosInstance
}