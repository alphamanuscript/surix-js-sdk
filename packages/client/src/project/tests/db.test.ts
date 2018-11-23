import * as api from '../../api';
import { getProjectDb } from '../db';

describe('Project DB', () => {
  describe('get', () => {
    it('should call the GET /project/:pid/entities/:id endpoint', async () => {
      const apiClient = api.getApiClient('http://baseurl');
      const spy = jest.spyOn(apiClient, 'get').mockReturnValue(Promise.resolve({}));
      const db = getProjectDb('project1', apiClient);
      const entity = await db.get('entity1');
      expect(apiClient.get).toHaveBeenCalledWith(`/project/project1/entities/entity1`);
    });
    it('should return the entity wrapped with EntityWrapper', async () => {
      const apiClient = api.getApiClient('http://baseurl');
      const rawEntity = {};
      const spy = jest.spyOn(apiClient, 'get').mockReturnValue(Promise.resolve(rawEntity));
      const db = getProjectDb('project1', apiClient);
      const entity = await db.get('entity1');
      expect(apiClient.get).toHaveBeenCalledWith(`/project/project1/entities/entity1`);
      expect(entity).toMatchSnapshot();
    });
  }); 
});