import * as dataHelpers from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import * as api from '../../api';
import { getProjectApi } from '../project';

import { DeletedEntities, Query } from '../../types';

describe('Project Entities', () => {
  const apiEntities = [
    {
      _id: 'e1',
      tags: ['t1'],
      createdBy: { _id: 'u1', type: 'user' },
      createdAt: '2017-02-22T09:19:33.885Z',
      updatedAt: '2018-10-22T09:19:33.885Z',
      data: {
        name: {
          type: 'text',
          value: 'name'
        }
      }
    },
    {
      _id: 'e2',
      tags: ['t2'],
      createdBy: { _id: 'u2', type: 'user' },
      createdAt: '2017-02-23T09:19:33.885Z',
      updatedAt: '2018-10-23T09:19:33.885Z',
      data: {
        name: {
          type: 'text',
          value: 'name'
        }
      }
    }
  ];
  describe('get', () => {
    let apiClient: AxiosInstance;
    async function callMockedGet (): Promise<dataHelpers.WrappedEntity> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'get').mockReturnValue(Promise.resolve({ data: apiEntities[0] }));
      jest.spyOn(dataHelpers, 'wrapEntity');
      const project = getProjectApi('project1', apiClient);
      const entity = await project.entities.get('e1');
      return entity;
    }
    it('should call the GET /project/:pid/entities/:id endpoint', async () => {
      await callMockedGet();
      expect(apiClient.get).toHaveBeenCalledWith(`/projects/project1/entities/e1`);
    });
    it('should return the entity transformed to WrappedEntity', async () => {
      const entity = await callMockedGet();
      expect(dataHelpers.wrapEntity).toHaveBeenCalledWith(apiEntities[0]);
      expect(entity).toMatchSnapshot();
    });
  });
  describe('query', () => {
    let apiClient: AxiosInstance;
    async function callMockedQuery (query?: Query): Promise<dataHelpers.WrappedEntity[]> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'post').mockReturnValue(Promise.resolve({ data: apiEntities }));
      jest.spyOn(dataHelpers, 'wrapEntityArray');
      const project = getProjectApi('project1', apiClient);
      const entities = await project.entities.query(query);
      return entities;
    }
    it(
      'should call the GET /project/:pid/entities/query endpoint with expanded query', async () => {
      const query = { query: { name: 'someone', birthdate: new Date('2019-12-12') }, limit: 10 };
      const expandedQuery = dataHelpers.expandQuery(query);
      await callMockedQuery(query);
      expect(apiClient.post).toHaveBeenCalledWith(
        `/projects/project1/entities/query`, expandedQuery);
    });
    it('should return the entities transformed to array of WrappedEntity', async () => {
      const query = { limit: 10 };
      const entities = await callMockedQuery(query);
      expect(dataHelpers.wrapEntityArray).toHaveBeenCalledWith(apiEntities);
      expect(entities).toMatchSnapshot();
    });
  
    describe('when query is not provided', () => {
      it('should call query endpoint with empty object', async () => {
        await callMockedQuery();
        expect(apiClient.post).toHaveBeenCalledWith(`/projects/project1/entities/query`, 
        {});
      });
    });
  }); 
  describe('create', () => {
    const userEntity = {
      data: {
        name: 'someone 1'
      },
      tags: []
    };
    let apiClient: AxiosInstance;
    async function callMockCreate (entity: any): Promise<dataHelpers.WrappedEntity> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'post').mockReturnValue(Promise.resolve({ data: 
        { entity } }));
      jest.spyOn(dataHelpers, 'wrapEntity');
      const project = getProjectApi('project1', apiClient);
      const ent = await project.entities.create(entity);
      return ent;
    }
    it('should call POST /projects/:pid/entities endpoint with entity', async () => {
      const entity = userEntity;
      const expectedEntity = dataHelpers.expandEntity(entity);
      await callMockCreate(entity);
      expect(apiClient.post).toHaveBeenCalledWith('/projects/project1/entities', expectedEntity);
    });
    it('should return an error', async () => {
      const ent = apiEntities[0];
      const entity = await callMockCreate(ent);
      expect(dataHelpers.wrapEntity).toHaveBeenCalledWith(ent);
      expect(entity).toMatchSnapshot();
    });
  });
  describe('update', () => {
    const userEntity = {
      _id: 'entity1',
      data: {
        name: 'someone 1'
      },
      tags: []
    };
    let apiClient: AxiosInstance;
    async function callMockUpdate (entity: any): Promise<dataHelpers.WrappedEntity> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'patch').mockReturnValue(Promise.resolve({ data: 
        { ...entity } }));
      jest.spyOn(dataHelpers, 'wrapEntity');
      const project = getProjectApi('project1', apiClient);
      const ent = await project.entities.update(entity);
      return ent;
    }
    it('should call PATCH /projects/:pid/entities/:eid endpoint with entity', async () => {
      const entity = { ...userEntity };
      const expectedEntity = dataHelpers.expandEntity(entity);
      // @ts-ignore
      delete expectedEntity._id;
      const frozen = Object.freeze(entity);
      await callMockUpdate(frozen);
      expect(apiClient.patch).toHaveBeenCalledWith(
        '/projects/project1/entities/entity1', expectedEntity);
    });
  });
  describe('put', () => {
    const userEntity = {
      data: {
        name: 'someone 1'
      },
      tags: []
    };
    let apiClient: AxiosInstance;
    async function callMockPut (entity: any): Promise<dataHelpers.WrappedEntity> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'put').mockReturnValue(Promise.resolve({ data: 
        { entity } }));
      jest.spyOn(dataHelpers, 'wrapEntity');
      const project = getProjectApi('project1', apiClient);
      const ent = await project.entities.put(entity);
      return ent;
    }
    it('should call PUT /projects/:pid/entities/:eid endpoint with entity', async () => {
      const entity = { ...userEntity };
      entity['_id'] = 'entity1';
      const expectedEntity = dataHelpers.expandEntity(entity);
      // @ts-ignore
      delete expectedEntity._id;
      const frozen = Object.freeze(entity);
      await callMockPut(frozen);
      expect(apiClient.put).toHaveBeenCalledWith(
        '/projects/project1/entities/entity1', expectedEntity);
    });
  });
  describe('delete', () => {
    let apiClient: AxiosInstance;
    async function callMockDelete (entityId: string): Promise<dataHelpers.WrappedEntity> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'delete').mockReturnValue(Promise.resolve({ data: 
        { ...apiEntities[0] } }));
      jest.spyOn(dataHelpers, 'wrapEntity');
      const project = getProjectApi('project1', apiClient);
      const ent = await project.entities.delete(entityId);
      return ent;
    }

    async function callMockDeleteMany (entityIds: string[]): Promise<DeletedEntities> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'delete').mockReturnValue(Promise.resolve({ data: 
        { deleted: entityIds.length } }));
      jest.spyOn(dataHelpers, 'wrapEntity');
      const project = getProjectApi('project1', apiClient);
      const ent = await project.entities.deleteMany(entityIds);
      return ent;
    }

    it('should call DELETE /projects/:pid/entities/:eid', async () => {
      const entityId = 'entity1';
      await callMockDelete(entityId);
      expect(apiClient.delete).toHaveBeenCalledWith(`/projects/project1/entities/${entityId}`);
    });
    it('should call DELETE /projects/:pid/entities with a list of entity ids', async () => {
      const entityIds = ['entity1', 'entity2'];

      await callMockDeleteMany(entityIds);
      expect(apiClient.delete).toHaveBeenCalledWith(`/projects/project1/entities`, 
      { data: { entities: entityIds } });
    });
  });
});