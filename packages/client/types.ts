import { EntityWrapper } from '@surix/data-helpers';

export interface Project {
  db: ProjectDatabase;
  files: ProjectFiles;
}

export interface ProjectDatabase {
  get(id: string): Promise<EntityWrapper>;
  query(query: Query): Promise<EntityWrapper[]>;
  getTags(): Promise<TagList[]>;
}

export interface ProjectFiles {
  get(id: string): Promise<ApiFile>;
  list(): Promise<ApiFile[]>;
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
  tags: TagList[];
}

export interface TagListItem {
  name: string;
}

export type TagList = TagListItem[];