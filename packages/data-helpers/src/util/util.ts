import {
  ApiEntity,
  Field,
  FieldPathArray,
  FieldType,
  FieldValue,
  ListValue,
  ObjectValue, 
  TypeValuePair} from '../types';

type WalkFieldArg = TypeValuePair | Field;
type WalkFieldReturn = TypeValuePair | Field | undefined;

export function toFieldPathArray (fieldPath: string): FieldPathArray {
  return fieldPath ? fieldPath.split('.') : [];
}

export function walkEntityPath (entity: ApiEntity, path: FieldPathArray): WalkFieldReturn {
  const [firstKey, ...pathRemaining] = path;
  if (firstKey in entity.data) {
    return walkFieldPath(entity.data[firstKey], pathRemaining);
  }
}

export function walkFieldPath (field: WalkFieldArg, path: FieldPathArray): WalkFieldReturn {
  const [firstKey, ...restPath] = path;
  if (typeof firstKey === 'undefined') {
    return field;
  }
  if (field.type === 'object' || field.type === 'list') {
    const value = field.value as ObjectValue | ListValue;
    if (firstKey in value) {
      const subField = value[firstKey];
      return walkFieldPath(subField, restPath);
    }
  }
}

export function deflateValue (value: any, type: FieldType): any {
  switch (type) {
    case 'datetime':
      return new Date(value);
    case 'number':
      return Number(value);
    case 'list':
      return deflateList(value);
    case 'object':
      return deflateObject(value);
    case 'boolean':
    case 'text':
    case 'file':
    default:
      return value;
  }
}

export function deflateText (textValue: string): string {
  return textValue;
}

export function deflateNumber (numValue: string): number {
  return Number(numValue);
}

export function deflateObject (obj: ObjectValue): object {
  return Object.keys(obj)
    .reduce((result, key) => {
      const { type, value } = obj[key];
      return {
        ...result,
        [key]: deflateValue(value, type)
      };
    }, {});
}

export function deflateList (list: ListValue): any[] {
  return list.map(({ type, value }) => deflateValue(value, type));
}

export function makeField (value: FieldValue, type: FieldType): Field {
  return {
    value,
    type
  };
}

function convertQueryDates(query: any): any {
  const internalQuery = { ...query };
  for(const [key, value] of Object.entries(internalQuery)) {
    switch(typeof value) {
      case 'object':
        if (Array.isArray(value)) {
          internalQuery[key] = value.map(query => convertQueryDates(query));
          // @ts-ignore
        } else if (typeof value.getMonth === 'function') {
          // @ts-ignore
          internalQuery[key] = { $treatAsDatetime: value.toISOString() };
          // @ts-ignore
        } else if (typeof value.exec === 'function') {
          internalQuery[key] = { 
            // @ts-ignore
            $regex: value.toString(), 
            // @ts-ignore
            $options: value.flags 
          }
        } else {
          internalQuery[key] = convertQueryDates(value);
        }
        break;
      default:
        internalQuery[key] = value;
    }
  }
  
  return internalQuery;
}

export function expandQuery(query:any): any {
  return { ...query, query: convertQueryDates(query.query) };
}
