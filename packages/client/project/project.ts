import { AxiosInstance } from 'axios';
import { getProjectDb } from './db';
import { getProjectFiles } from './files';

import { Project } from '../types';

export function getProjectApi (projectId: string, apiClient: AxiosInstance): Project {
  return {
    db: getProjectDb(projectId, apiClient),
    files: getProjectFiles(projectId, apiClient)
  };
}