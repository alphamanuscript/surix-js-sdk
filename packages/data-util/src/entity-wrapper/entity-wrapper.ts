import { ApiEntity, AuthContext, FieldPathArray } from '../types';
import { dehydrateValue, toFieldPathArray, walkEntityPath } from '../util';

export class EntityWrapper {
  private _entity: ApiEntity;
  constructor (rawEntity: ApiEntity) {
    this._entity = rawEntity;
  }

  /**
   * the raw entity from the Surix API
   */
  get rawEntity (): ApiEntity {
    return this._entity;
  }

  /**
   * the unique id of the entity
   */
  get _id (): string {
    return this._entity._id;
  }

  /**
   * the unique id of the entity
   * @alias _id
   */
  get id (): string {
    return this._id;
  }

  /**
   * the list of tags that the entity belongs to
   */
  get tags (): string[] {
    return this._entity.tags;
  }

  /**
   * the principal that created the entity
   */
  get createdBy (): AuthContext {
    return this._entity.createdBy;
  }

  /**
   * date when the entity was created
   */
  get createdAt (): Date {
    return new Date(this._entity.createdAt);
  }

  /**
   * date when the entity was last updated
   */
  get updatedAt (): Date {
    return new Date(this._entity.updatedAt);
  }

  /**
   * returns the plain value of the field at the specified path
   * @param fieldPath the key of the field, this can be a
   * dotted string "field.nestedField" or an array ["field", "nestedField"]
   * the path can include field names as well as array indices
   * @param defaultValue 
   */
  value (fieldPath: string | FieldPathArray, defaultValue?: any): any {
    const pathArray = Array.isArray(fieldPath) && fieldPath || toFieldPathArray(fieldPath);
    return this._value(pathArray, defaultValue);
  }
  _value (fieldPath: FieldPathArray, defaultValue?: any): any {
    const field = walkEntityPath(this._entity, fieldPath);
    return field ? dehydrateValue(field.value, field.type) : defaultValue;
  }
    
}