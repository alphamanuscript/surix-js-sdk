import * as api from '../../api';
import * as projectApi from '../../project';
import { Client } from '../client';

describe('Client', () => {
  describe('new instance', () => {
    it('should create http client based on production Surix API url', () => {
      const spy = jest.spyOn(api, 'getApiClient');
      new Client();
      expect(spy.mock.calls).toMatchSnapshot();
      spy.mockRestore();
    });
    describe('when environment is not set to production', () => {
      it('should create http client based on staging url', () => {
        const spy = jest.spyOn(api, 'getApiClient');
        new Client({ environment: 'staging' });
        expect(spy.mock.calls).toMatchSnapshot();
        spy.mockRestore();
      });
    });
    it('should override baseUrl if baseUrl option is provided', () => {
      const spy = jest.spyOn(api, 'getApiClient');
      const baseUrl = 'http://mydomain.com/api';
      new Client({ baseUrl });
      expect(spy.mock.calls).toMatchSnapshot();
      spy.mockRestore();
    });
  });

  describe('project', () => {
    it('should call getProjectApi with project id and apiClient', () => {
      const apiClient = {};
      jest.spyOn(api, 'getApiClient').mockReturnValue(apiClient);
      jest.spyOn(projectApi, 'getProjectApi');
      const client = new Client();
      client.project('id');
      expect(projectApi.getProjectApi).toHaveBeenCalledWith('id', apiClient);
    });
  });
});