import { ApiEntity, AuthContext, FieldPathArray } from '../types';
import { dehydrateValue, toFieldPathArray, walkEntityPath } from '../util';

export class EntityWrapper {
  private _entity: ApiEntity;
  constructor (rawEntity: ApiEntity) {
    this._entity = rawEntity;
  }

  get rawEntity (): ApiEntity {
    return this._entity;
  }

  get _id (): string {
    return this._entity._id;
  }

  get tags (): string[] {
    return this._entity.tags;
  }

  get createdBy (): AuthContext {
    return this._entity.createdBy;
  }

  get createdAt (): Date {
    return new Date(this._entity.createdAt);
  }

  get updatedAt (): Date {
    return new Date(this._entity.updatedAt);
  }

  value (fieldPath: string | FieldPathArray): any {
    const pathArray = Array.isArray(fieldPath) && fieldPath || toFieldPathArray(fieldPath);
    return this._value(pathArray);
  }
  _value (fieldPath: FieldPathArray): any {
    const field = walkEntityPath(this._entity, fieldPath);
    if (field) {
      return dehydrateValue(field.value, field.type);
    }
  }
    
}