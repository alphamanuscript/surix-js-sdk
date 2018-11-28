import { ApiEntity, EntityWrapper } from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import { ProjectEntities, Query, TagList } from '../types';

export function getProjectEntities (projectId: string, apiClient: AxiosInstance): ProjectEntities {
  return {
    async get (entityId: string): Promise<EntityWrapper> {
      const res = await apiClient.get<ApiEntity>(`/projects/${projectId}/entities/${entityId}`);
      return new EntityWrapper(res.data);
    },
    async query(query: Query): Promise<EntityWrapper[]> {
      const res = await apiClient.post<ApiEntity[]>(`/projects/${projectId}/entities/query`, query);
      const entities = res.data;
      return entities.map(entity => new EntityWrapper(entity));
    }
  };
}