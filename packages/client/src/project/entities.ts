import { ApiEntity, WrappedEntity, wrapEntity, wrapEntityArray } from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import { ProjectEntities, Query, TagList } from '../types';

export function getProjectEntities (projectId: string, apiClient: AxiosInstance): ProjectEntities {
  return {
    async get (entityId: string): Promise<WrappedEntity> {
      const res = await apiClient.get<ApiEntity>(`/projects/${projectId}/entities/${entityId}`);
      return wrapEntity(res);
    },
    async query(query: Query): Promise<WrappedEntity[]> {
      const res = await apiClient.post<ApiEntity[]>(`/projects/${projectId}/entities/query`, query);
      const entities = res.data;
      return wrapEntityArray(entities);
    }
  };
}