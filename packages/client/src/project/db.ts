import { ApiEntity, EntityWrapper } from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import { ProjectDatabase, Query, TagList } from '../types';

export function getProjectDb (projectId: string, apiClient: AxiosInstance): ProjectDatabase {
  return {
    async get (entityId: string): Promise<EntityWrapper> {
      const res = await apiClient.get<ApiEntity>(`/projects/${projectId}/entities/${entityId}`);
      return new EntityWrapper(res.data);
    },
    async query(query: Query): Promise<EntityWrapper[]> {
      const res = await apiClient.post<ApiEntity[]>(`/projects/${projectId}/entities/query`, query);
      const entities = res.data;
      return entities.map(entity => new EntityWrapper(entity));
    },
    async getTags (): Promise<TagList[]> {
      const res = await apiClient.get<TagList[]>(`/projects/${projectId}/tags`);
      return res.data;
    }
  };
}