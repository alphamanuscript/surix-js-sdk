import { getApiClient } from '../api';
import { getProjectApi } from '../project';
import { Project } from '../types';

const PRODUCTION_URL = 'https://api.surix.co';
const STAGING_URL = 'https://surix-staging.firebaseapp.com';

export interface ClientOptions {
  environment?: 'production' | 'staging' ;
}

export class SurixClient {
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



