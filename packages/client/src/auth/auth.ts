import { Credentials, AuthKeyDetails } from '../types';
import { AxiosInstance } from 'axios';

export async function auth(credentials: Credentials, apiClient: AxiosInstance): Promise<AuthKeyDetails> {
    const res =  await apiClient.post<AuthKeyDetails>('/users/login');
    return res.data
}