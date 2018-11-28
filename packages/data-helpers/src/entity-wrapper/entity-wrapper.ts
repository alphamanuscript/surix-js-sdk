import {
  ApiEntity,
  AuthContext,
  Field,
  FieldOrValuePair,
  FieldPathArray,
  FieldType,
  NullableFieldOrValuePair,
  WrappedEntity } from '../types';
import { deflateValue, toFieldPathArray, walkEntityPath } from '../util';

const normalizeFieldPath = (fieldPath: string|FieldPathArray): FieldPathArray =>
   Array.isArray(fieldPath) && fieldPath || toFieldPathArray(fieldPath);

export class EntityWrapper implements WrappedEntity {
  private _entity: ApiEntity;
  private _dataCache: object;

  createdAt: Date;

  updatedAt: Date;

  constructor (rawEntity: ApiEntity) {
    this._entity = rawEntity;
    this.createdAt = new Date(this._entity.createdAt);
    this.updatedAt = new Date(this._entity.updatedAt);
  }

  get rawEntity (): ApiEntity {
    return this._entity;
  }

  get _id (): string {
    return this._entity._id;
  }

  get id (): string {
    return this._id;
  }

  get tags (): string[] {
    return this._entity.tags;
  }

  get createdBy (): AuthContext {
    return this._entity.createdBy;
  }

  get (fieldPath: string | FieldPathArray, defaultValue?: any): any {
    const pathArray = normalizeFieldPath(fieldPath);
    return this._value(pathArray, defaultValue);
  }

  private _value (fieldPath: FieldPathArray, defaultValue?: any): any {
    const field = walkEntityPath(this._entity, fieldPath);
    return field ? deflateValue(field.value, field.type) : defaultValue;
  }

  type (fieldPath: string | FieldPathArray, defaultType?: FieldType): FieldType|undefined {
    const pathArray = normalizeFieldPath(fieldPath);
    const field = walkEntityPath(this._entity, pathArray);
    return field ? field.type : defaultType;
  }

  label (fieldPath: string | FieldPathArray, defaultLabel?: string): string|undefined {
    const pathArray = normalizeFieldPath(fieldPath);
    const field = walkEntityPath(this._entity, pathArray) as Field;
    return field && field.label ? field.label : defaultLabel;
  } 

  field (fieldPath: string | FieldPathArray, defaultField?: FieldOrValuePair):
  NullableFieldOrValuePair {
    const pathArray = normalizeFieldPath(fieldPath);
    const field = walkEntityPath(this._entity, pathArray);
    return field || defaultField;
  } 

  data (): object {
    if (!this._dataCache) {
      this._dataCache = deflateValue(this._entity.data, 'object');
    }
    return this._dataCache;
  }
}

export function wrapEntity (entity: ApiEntity): WrappedEntity {
  return new EntityWrapper(entity);
}

export function wrapEntityArray (entities: ApiEntity[]): WrappedEntity[] {
  return entities.map(wrapEntity);
}