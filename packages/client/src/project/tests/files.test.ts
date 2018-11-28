import * as dataHelpers from '@surix/data-helpers';
import { AxiosInstance } from 'axios';
import * as api from '../../api';
import { getProjectApi } from '../project';

describe('Project Files', () => {
  let apiFiles: dataHelpers.ApiFile[];
  beforeEach(() => {
    apiFiles = [
      {
        _id: 'f1',
        name: 'F1',
        filename: 'f1.jpeg',
        mimeType: 'image/jpeg',
        status: 'ready',
        size: 200,
        public: true,
        downloadUrl: 'http://download/f1',
        uploadUrl: 'http://upload/f1',
        tags: ['t1'],
        createdBy: { _id: 'u1', type: 'user' },
        createdAt: '2017-02-22T09:19:33.885Z',
        updatedAt: '2018-10-22T09:19:33.885Z',
      },
      {
        _id: 'f2',
        name: 'F2',
        filename: 'f2.jpeg',
        mimeType: 'image/jpeg',
        status: 'pending',
        size: 0,
        public: true,
        downloadUrl: '',
        uploadUrl: 'http://upload/f1',
        tags: ['t1'],
        createdBy: { _id: 'u1', type: 'user' },
        createdAt: '2017-02-22T09:19:33.885Z',
        updatedAt: '2018-10-22T09:19:33.885Z',
      },
    ];
  });

  describe('get', () => {
    let apiClient: AxiosInstance;
    function callMockedGet (): Promise<dataHelpers.WrappedFile> {
      apiClient = api.getApiClient('http://baseurl');
      jest.spyOn(apiClient, 'get').mockReturnValue(
        Promise.resolve({ data: apiFiles[0] })
      );
      jest.spyOn(dataHelpers, 'wrapFile');
      const project = getProjectApi('project1', apiClient);
      return project.files.get('f1');
    }
    it('should call the GET /project/:pid/files/:id endpoint', async () => {
      await callMockedGet();
      expect(apiClient.get).toHaveBeenCalledWith(`/projects/project1/files/f1`);
    });
    it('should return the wrapped file', async () => {
      const file = await callMockedGet();
      expect(dataHelpers.wrapFile).toHaveBeenCalledWith(apiFiles[0]);
      expect(file).toMatchSnapshot();
    });
  });

  describe('list', () => {
    let apiClient: AxiosInstance;
    function callMockedList (): Promise<dataHelpers.WrappedFile[]> {
      apiClient = api.getApiClient('http://baseurl');
      jest.spyOn(apiClient, 'get').mockReturnValue(
        Promise.resolve({ data: apiFiles })
      );
      jest.spyOn(dataHelpers, 'wrapFileArray');
      const project = getProjectApi('project1', apiClient);
      return project.files.list();
    }
    it('should call the GET /project/:pid/files endpoint', async () => {
      await callMockedList();
      expect(apiClient.get).toHaveBeenCalledWith(`/projects/project1/files`);
    });
    it('should return the wrapped file array', async () => {
      const files = await callMockedList();
      expect(dataHelpers.wrapFileArray).toHaveBeenCalledWith(apiFiles);
      expect(files).toMatchSnapshot();
    });
  });
});