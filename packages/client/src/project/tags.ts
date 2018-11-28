import { AxiosInstance } from 'axios';
import { ProjectTags, TagList  } from '../types';

export function getProjectTags (projectId: string, apiClient: AxiosInstance): ProjectTags {
  return {
    async list (): Promise<TagList> {
      const res = await apiClient.get<TagList>(`/projects/${projectId}/tags`);
      return res.data;
    }
  };
}