import { EntityWrapper } from '@surix/data-helpers';

export interface Project {
  entities: ProjectEntities;
  files: ProjectFiles;
  tags: ProjectTags;
}

export interface ProjectEntities {
  get(id: string): Promise<EntityWrapper>;
  query(query: Query): Promise<EntityWrapper[]>;
}

export interface ProjectFiles {
  get(id: string): Promise<ApiFile>;
  list(): Promise<ApiFile[]>;
}

export interface ProjectTags {
  list(): Promise<TagList>;
}

export interface Query {
  tags?: string[];
  skip?: number;
  limit?: number;
  query?: object;
}

export interface ApiFile {
  name: string;
  status: 'failed' | 'ready' | 'pending';
  public: boolean;
  downloadUrl: string;
  tags: string[];
}

export interface TagListItem {
  name: string;
}

export type TagList = TagListItem[];