import { AxiosInstance } from 'axios';
import { ProjectTags, Tag, TagList  } from '../types';

export function getProjectTags (projectId: string, apiClient: AxiosInstance): ProjectTags {
  return {
    async list (): Promise<TagList> {
      const res = await apiClient.get<TagList>(`/projects/${projectId}/tags`);
      return res.data;
    }, 
    async rename (oldName: string, newName: string): Promise<Tag> {
      const res = await apiClient.put<Tag>(`/projects/${projectId}/tags/${oldName}`, {
        name: newName
      });
      return res.data;
    }
  };
}