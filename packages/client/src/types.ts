import { WrappedEntity, WrappedFile } from '@surix/data-helpers';

export interface Project {
  entities: ProjectEntities;
  files: ProjectFiles;
  tags: ProjectTags;
}

export interface ProjectEntities {
  /**
   * Fetches an entity with the given id
   * @param id An ID indetifying an entity
   * @returns {Promise<WrappedEntity>}
   */
  get(id: string): Promise<WrappedEntity>;
  /**
   * Fetches entities based on the provided query
   * @param query A query to be used to fetch entities
   * @returns {Promise<WrappedEntity[]>}
   */
  query(query?: Query): Promise<WrappedEntity[]>;
  /**
   * Creates and saves the provided entity
   * @param {Entity} entity An entity
   * @returns {Promise<WrappedEntity>}
   */
  create(entity: Entity): Promise<WrappedEntity>;
  /**
   * Updates the entity identified by the _id property provided.
   * @param {Entity} entity An entity
   * @returns {Promise<WrappedEntity>}
   */
  update(entity: Entity): Promise<WrappedEntity>;
  /**
   * Replaces the entity identified by the _id property provided.
   * @param {Entity} entity An entity
   * @returns {Promise<WrappedEntity>}
   */
  put(entity: Entity): Promise<WrappedEntity>;
  /**
   * Completely removes an etity identified by the id provided.
   * @param {string} entityId An ID
   */
  delete(entityId: string): Promise<WrappedEntity>;
  /**
   * Deletes a bunch of entities that have the provided IDs
   * @param {EntityIds} entityIds A list of IDs
   */
  deleteMany(entityIds: string[]): Promise<DeletedEntities>;
}

export interface DeletedEntities {
  deleted: number;
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