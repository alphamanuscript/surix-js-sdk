import { WrappedEntity, WrappedFile } from '@surix/data-helpers';

export interface Project {
  entities: ProjectEntities;
  files: ProjectFiles;
  tags: ProjectTags;
}

export interface ProjectEntities {
  get(id: string): Promise<WrappedEntity>;
  query(query?: Query): Promise<WrappedEntity[]>;
  create(entity: Entity): Promise<WrappedEntity>;
  put(entity: Entity): Promise<WrappedEntity>;
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

export type TagList = TagListItem[];

export enum FieldType {
  TEXT = 'text',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  DATETIME = 'datetime',
  PHONE = 'phone',
  EMAIL = 'email',
  FILE = 'file',
  OBJECT = 'object',
  LIST = 'list'
}

export interface FieldPair {
  type: FieldType;
  value: RawEntityData | string | RawEntityData[] | number;
}

export interface RawEntityField extends FieldPair {
}

export interface RawEntityData {
  [fieldName: string]: RawEntityField;
}

/**
 * this interface describe the shape of the entity
 * as used within the system and the API
 */
export interface RawEntity {
  data: RawEntityData;
  tags?: string[];
}

export interface DataField {
  [fieldName: string]: string | number | object | boolean;
}
export interface Entity {
  data: DataField;
  tags?: string[];
  _id?: string;
}