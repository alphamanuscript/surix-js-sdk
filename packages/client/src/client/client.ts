import { getApiClient } from '../api';
import { getProjectApi } from '../project';
import { Project } from '../types';
import { AxiosInstance } from 'axios';

export const PRODUCTION_URL = 'https://api.surix.co/api';
export const STAGING_URL = 'https://surix-staging.herokuapp.com/api';

export interface ClientOptions {
  environment?: 'production' | 'staging';
  baseUrl?: string;
  keyId: string;
  keySecret: string;
}

export class Client {
  private _apiClient: AxiosInstance;

  constructor (opts: ClientOptions) {
    const _opts: ClientOptions = Object.assign({
      environment: 'production',
      baseUrl: ''
    }, opts);
    let baseUrl = _opts.environment === 'production' ? PRODUCTION_URL : STAGING_URL;
    baseUrl = _opts.baseUrl || baseUrl;
    const apiKey = `${_opts.keyId}:${_opts.keySecret}` 
    this._apiClient = getApiClient(baseUrl, apiKey);
  }

  project (id: string): Project {
    return getProjectApi(id, this._apiClient);
  }
}



