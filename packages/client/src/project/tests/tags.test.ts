import * as dataHelpers from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import * as api from '../../api';
import { getProjectTags } from '../tags';

describe('Project tags', () => {
  describe('list', () => {
    let apiClient: AxiosInstance;
    const tags = [
      { name: 'posts' },
      { name: 'users' }
    ];
    function callMockedList(): Promise<any[]> {
      apiClient = api.getApiClient('http://baseurl');
      jest.spyOn(apiClient, 'get').mockReturnValue(
        Promise.resolve({ data: tags })
      );
      const db = getProjectTags('project1', apiClient);
      return db.list();
    }
    it('should call projects/:pid/tags endpoint', async () => {
      await callMockedList();
      expect(apiClient.get).toHaveBeenCalledWith(
        '/projects/project1/tags'
      );
    });
    it('should return tags list', async () => {
      const tags = await callMockedList();
      expect(tags).toMatchSnapshot();
     });
  });
});