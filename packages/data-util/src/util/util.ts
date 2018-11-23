import {
  ApiEntity,
  Field,
  FieldPathArray,
  FieldType,
  FieldValue,
  ListValue,
  ObjectValue } from '../types';

export function toFieldPathArray (fieldPath: string): FieldPathArray {
  return fieldPath.split('.');
}

export function walkEntityPath (entity: ApiEntity, path: FieldPathArray): any {
  return walkObjectPath(entity.data, path);
}

export function walkObjectPath (obj: ObjectValue | ListValue, path: FieldPathArray): any {
  const [firstKey, ...restPath] = path;
  if (typeof firstKey === 'undefined') {
    return Array.isArray(obj) ? dehydrateList(obj) : dehydrateObject(obj);
  }
  if (firstKey in obj) {
    const field = obj[firstKey];
    if (field.type === 'object' || field.type === 'list') {
      return walkObjectPath(field.value, restPath);
    }
    return dehydrateValue(field.value, field.type);
  }
}

export function dehydrateValue (value: any, type: FieldType): any {
  switch (type) {
    case 'datetime':
      return new Date(value);
    case 'number':
      return Number(value);
    case 'list':
      return dehydrateList(value);
    case 'object':
      return dehydrateObject(value);
    case 'boolean':
    case 'text':
    case 'file':
    default:
      return value;
  }
}

export function dehydrateText (textValue: string): string {
  return textValue;
}

export function dehydrateNumber (numValue: string): number {
  return Number(numValue);
}

export function dehydrateObject (obj: ObjectValue): object {
  return Object.keys(obj)
    .reduce((result, key) => {
      const { type, value } = obj[key];
      return {
        ...result,
        [key]: dehydrateValue(value, type)
      };
    }, {});
}

export function dehydrateList (list: ListValue): any[] {
  return list.map(({ type, value }) => dehydrateValue(value, type));
}

export function makeField (value: FieldValue, type: FieldType, name: string, label: string): Field {
  return {
    value,
    type,
    name,
    label
  };
}