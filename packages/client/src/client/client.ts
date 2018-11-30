import { getApiClient } from '../api';
import { getProjectApi } from '../project';
import { Project } from '../types';

export const PRODUCTION_URL = 'https://api.surix.co/api';
export const STAGING_URL = 'https://surix-staging.herokuapp.com/api';

export interface ClientOptions {
  environment?: 'production' | 'staging';
  baseUrl?: string;
}

export class Client {
  private _apiClient;

  constructor (opts: ClientOptions = {}) {
    const _opts = Object.assign({
      environment: 'production',
      baseUrl: ''
    }, opts);
    let baseUrl = _opts.environment === 'production' ? PRODUCTION_URL : STAGING_URL;
    baseUrl = _opts.baseUrl || baseUrl;
    this._apiClient = getApiClient(baseUrl);
  }

  project (id: string): Project {
    return getProjectApi(id, this._apiClient);
  }
}



