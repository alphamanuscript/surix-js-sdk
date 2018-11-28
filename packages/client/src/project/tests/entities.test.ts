import * as dataHelpers from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import * as api from '../../api';
import { getProjectApi } from '../project';

import { Query } from '../../types';

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
          value: 'Foo',
          name: 'name',
          label: 'Label'
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
          value: 'Bar',
          name: 'name',
          label: 'Label'
        }
      }
    }
  ];
  describe('get', () => {
    let apiClient: AxiosInstance;
    async function callMockedGet (): Promise<dataHelpers.WrappedEntity> {
      apiClient = api.getApiClient('http://baseurl');
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
      apiClient = api.getApiClient('http://baseurl');
      jest.spyOn(apiClient, 'post').mockReturnValue(Promise.resolve({ data: apiEntities }));
      jest.spyOn(dataHelpers, 'wrapEntityArray');
      const project = getProjectApi('project1', apiClient);
      const entities = await project.entities.query(query);
      return entities;
    }
    it('should call the GET /project/:pid/entities/query endpoint with query', async () => {
      const query = { limit: 10 };
      await callMockedQuery(query);
      expect(apiClient.post).toHaveBeenCalledWith(`/projects/project1/entities/query`, query);
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
        expect(apiClient.post).toHaveBeenCalledWith(`/projects/project1/entities/query`, {});
      });
    });
  }); 
});