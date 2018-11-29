import * as api from '../../api';
import * as projectApi from '../../project';
import { SurixClient } from '../client';

describe('Client', () => {
  describe('new instance', () => {
    it('should create http client based on production Surix API url', () => {
      const spy = jest.spyOn(api, 'getApiClient');
      new SurixClient();
      expect(spy.mock.calls).toMatchSnapshot();
    });
    describe('when environment is not set to production', () => {
      it('should create http client based on staging url', () => {
        const spy = jest.spyOn(api, 'getApiClient');
        new SurixClient({ environment: 'staging' });
        expect(spy.mock.calls).toMatchSnapshot();
      });
    });
  });

  describe('project', () => {
    it('should call getProjectApi with project id and apiClient', () => {
      const apiClient = {};
      jest.spyOn(api, 'getApiClient').mockReturnValue(apiClient);
      jest.spyOn(projectApi, 'getProjectApi');
      const client = new SurixClient();
      client.project('id');
      expect(projectApi.getProjectApi).toHaveBeenCalledWith('id', apiClient);
    });
  });
});