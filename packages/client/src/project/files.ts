import {
  ApiFile,
  wrapFile,
  wrapFileArray,
  WrappedFile } from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import { ProjectFiles} from '../types';

export function getProjectFiles (projectId: string, apiClient: AxiosInstance): ProjectFiles {
  return {
    async get (fileId: string): Promise<WrappedFile> {
      const res = await apiClient.get<ApiFile>(`/projects/${projectId}/files/${fileId}`);
      return wrapFile(res.data);
    },
    async list (): Promise<WrappedFile[]> {
      const res = await apiClient.get<ApiFile[]>(`/projects/${projectId}/files`);
      return wrapFileArray(res.data);
    }
  };
}