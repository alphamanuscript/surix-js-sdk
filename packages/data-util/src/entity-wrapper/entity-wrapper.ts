import { ApiEntity, AuthContext, Field, FieldPathArray, FieldType, TypeValuePair } from '../types';
import { dehydrateValue, toFieldPathArray, walkEntityPath } from '../util';

type FieldOrValuePair = Field | TypeValuePair;
type NullableFieldOrValuePair = FieldOrValuePair | undefined;

const normalizeFieldPath = (fieldPath: string|FieldPathArray): FieldPathArray =>
   Array.isArray(fieldPath) && fieldPath || toFieldPathArray(fieldPath);

export class EntityWrapper {
  private _entity: ApiEntity;
  private _dataCache: object;

  /**
   * 
   * @param rawEntity raw entity from the Surix API
   */
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
    const pathArray = normalizeFieldPath(fieldPath);
    return this._value(pathArray, defaultValue);
  }

  private _value (fieldPath: FieldPathArray, defaultValue?: any): any {
    const field = walkEntityPath(this._entity, fieldPath);
    return field ? dehydrateValue(field.value, field.type) : defaultValue;
  }

  /**
   * returns the type of the field with the specified key
   * @param fieldPath the key of the field, this can be a
   * dotted string "field.nestedField" or an array ["field", "nestedField"]
   * the path can include field names as well as array indices
   * @param defaultType the type to return if the entity does not have the field
   */
  type (fieldPath: string | FieldPathArray, defaultType?: FieldType): FieldType|undefined {
    const pathArray = normalizeFieldPath(fieldPath);
    const field = walkEntityPath(this._entity, pathArray);
    return field ? field.type : defaultType;
  }

  /**
   * returns the label of the field with the specified key
   * @param fieldPath the key of the field, this can be a
   * dotted string "field.nestedField" or an array ["field", "nestedField"]
   * the path can include field names as well as array indices
   * @param defaultLabel the label to return if the field does not exist
   */
  label (fieldPath: string | FieldPathArray, defaultLabel?: string): string|undefined {
    const pathArray = normalizeFieldPath(fieldPath);
    const field = walkEntityPath(this._entity, pathArray) as Field;
    return field && field.label ? field.label : defaultLabel;
  } 

  /**
   * returns the raw field at the specified key
   * @param fieldPath the key of the field, this can be a
   * dotted string "field.nestedField" or an array ["field", "nestedField"]
   * the path can include field names as well as array indices
   * @param defaultField the type to return if the entity does not have the field
   */
  field (fieldPath: string | FieldPathArray, defaultField?: FieldOrValuePair):
  NullableFieldOrValuePair {
    const pathArray = normalizeFieldPath(fieldPath);
    const field = walkEntityPath(this._entity, pathArray);
    return field || defaultField;
  } 

  /**
   * returns the entity data
   * as plain (deflated) key-value pair
   */
  data (): object {
    if (!this._dataCache) {
      this._dataCache = dehydrateValue(this._entity.data, 'object');
    }
    return this._dataCache;
  }
}