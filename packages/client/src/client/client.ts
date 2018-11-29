import { getApiClient } from '../api';
import { getProjectApi } from '../project';
import { Project } from '../types';

export const PRODUCTION_URL = 'https://api.surix.co';
export const STAGING_URL = 'https://surix-staging.herokuapp.com';

export interface ClientOptions {
  environment?: 'production' | 'staging' ;
}

export class Client {
  private _apiClient;

  constructor (opts?: ClientOptions) {
    const _opts = opts || {
      environment: 'production'
    };
    const baseUrl = _opts.environment === 'production' ? PRODUCTION_URL : STAGING_URL;
    this._apiClient = getApiClient(baseUrl);
  }

  project (id: string): Project {
    return getProjectApi(id, this._apiClient);
  }
}



