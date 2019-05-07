import { WrappedEntity, WrappedFile } from '@surix/data-helpers';

export interface Project {
  entities: ProjectEntities;
  files: ProjectFiles;
  tags: ProjectTags;
}

export interface ProjectEntities {
  get(id: string): Promise<WrappedEntity>;
  query(query?: Query): Promise<WrappedEntity[]>;
}

export interface ProjectFiles {
  get(id: string): Promise<WrappedFile>;
  list(): Promise<WrappedFile[]>;
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

export interface TagListItem {
  name: string;
}

export interface Credentials {
  email: string;
  password: string
}

interface Timestamps {
  createdAt: Date;
  updatedAt: Date
}

interface Id {
  _id: string
}

interface AccessToken extends Id, Timestamps {
  user: string;
  expiryDate: Date
}

interface User extends Id, Timestamps {
  email: string
}
 export interface AuthKeyDetails {
  accessToken: AccessToken;
  user: User
}

export type TagList = TagListItem[];