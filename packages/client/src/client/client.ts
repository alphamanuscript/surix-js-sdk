import { AxiosInstance } from 'axios';
import { getApiClient } from '../api';
import { getProjectApi } from '../project';
import { Project } from '../types';

export const PRODUCTION_URL = 'https://surix-review3.herokuapp.com/api';

export interface ClientOptions {
  keyId: string;
  keySecret: string;
}

export class Client {
  private _apiClient: AxiosInstance;

  constructor (opts: ClientOptions) {
    const _opts = { ...opts };
    const apiKey = `${_opts.keyId}:${_opts.keySecret}`;
    this._apiClient = getApiClient(PRODUCTION_URL, apiKey);
  }

  project (id: string): Project {
    return getProjectApi(id, this._apiClient);
  }
}



