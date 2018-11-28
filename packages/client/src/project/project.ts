import { AxiosInstance } from 'axios';
import { getProjectEntities } from './entities';
import { getProjectFiles } from './files';

import { Project } from '../types';
import { getProjectTags } from './tags';

export function getProjectApi (projectId: string, apiClient: AxiosInstance): Project {
  return {
    entities: getProjectEntities(projectId, apiClient),
    files: getProjectFiles(projectId, apiClient),
    tags: getProjectTags(projectId, apiClient)
  };
}