import { ApiEntity,  expandEntity, wrapEntity, wrapEntityArray, WrappedEntity} from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import {  Entity, ProjectEntities, Query } from '../types';

export function getProjectEntities (projectId: string, apiClient: AxiosInstance): ProjectEntities {
  return {
    async get(entityId: string): Promise<WrappedEntity> {
      const res = await apiClient.get<ApiEntity>(`/projects/${projectId}/entities/${entityId}`);
      return wrapEntity(res.data);
    },
    async query(query: Query = {}): Promise<WrappedEntity[]> {
      const res = await apiClient.post<ApiEntity[]>(`/projects/${projectId}/entities/query`, query);
      const entities = res.data;
      return wrapEntityArray(entities);
    },
    async update(entity: Entity): Promise<WrappedEntity> {
      const _entity = { ...entity };
      const entityId = _entity._id;
      delete _entity._id;
      const expandedEntity = expandEntity(_entity);
      const res = await apiClient.patch<ApiEntity>(
        `/projects/${projectId}/entities/${entityId}`, expandedEntity);
      const returnedEntity = res.data;
      return wrapEntity(returnedEntity);
    },
    async put(entity: Entity): Promise<WrappedEntity> {
      const _entity = { ...entity }; // Make a shallow copy
      const entityId = _entity._id;
      delete _entity._id;
      const expandedEntity = expandEntity(_entity);
      const res = await apiClient.put<ApiEntity>(
        `/projects/${projectId}/entities/${entityId}`, expandedEntity);
      const returnedEntity = res.data;
      return wrapEntity(returnedEntity);
    },
    async create(entity: Entity): Promise<WrappedEntity> {
      const expandedEntity = expandEntity(entity);
      const res = await apiClient.post<ApiEntity>(
        `/projects/${projectId}/entities`, expandedEntity);
      const returnedEntity = res.data;
      return wrapEntity(returnedEntity);
    }
  };
}