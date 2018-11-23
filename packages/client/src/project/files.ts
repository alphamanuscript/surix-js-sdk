import { AxiosInstance } from 'axios';
import { ApiFile, ProjectFiles } from '../types';

export function getProjectFiles (projectId: string, apiClient: AxiosInstance): ProjectFiles {
  return {
    async get (fileId: string): Promise<ApiFile> {
      const res = await apiClient.get<ApiFile>(`/projects/${projectId}/files/${fileId}`);
      return res.data;
    },
    async list (): Promise<ApiFile[]> {
      const res = await apiClient.get<ApiFile[]>(`/projects/${projectId}/files`);
      return res.data;
    }
  };
}