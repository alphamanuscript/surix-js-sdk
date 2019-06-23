import * as dataHelpers from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import * as api from '../../api';
import { Tag } from '../../types';
import { getProjectApi } from '../project';

describe('Project tags', () => {
  describe('list', () => {
    let apiClient: AxiosInstance;
    const tags = [
      { name: 'posts' },
      { name: 'users' }
    ];
    function callMockedList(): Promise<any[]> {
      apiClient = api.getApiClient('http://baseurl', 'somekey');
      jest.spyOn(apiClient, 'get').mockReturnValue(
        Promise.resolve({ data: tags })
      );
      const project = getProjectApi('project1', apiClient);
      return project.tags.list();
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
  describe('Rename', () => {
    let apiClient: AxiosInstance;
    let newTag = {
      name: 'newName'
    }
    function callMockedRename(): Promise<Tag> {
      apiClient = api.getApiClient('someid', 'somekey');
      jest.spyOn(apiClient, 'put').mockReturnValue(
        Promise.resolve({ data: newTag })
      );
      const project = getProjectApi('project1', apiClient);
      return project.tags.rename('oldName', 'newName');
    }
    it('should call projects/:pid/tags/:oldName endpoint', async () => {
      await callMockedRename();
      expect(apiClient.put).toHaveBeenCalledWith(
        '/projects/project1/tags/oldName',
        { name: 'newName' }
      );
    });
    it('should return the nre tag', async () => {
      const tag = await callMockedRename();
      expect(tag).toMatchSnapshot();
    });
  });
});