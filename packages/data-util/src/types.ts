export class ApiEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
    data: ObjectValue;
    createdBy: AuthContext;
    tags: string[];
}

export type FieldPathArray = Array<string|number>;

export type FieldType = 'text' | 'boolean' | 'number' | 'datetime'
    | 'file' | 'object' | 'list';

export type FieldValue = string | boolean | FileValue | ListValue | ObjectValue;

export interface FileValue {
    ref: string;
    mimeType: string;
    downloadUrl: string;
}

export type ListValue = ListItemValue[];

export interface ListItemValue {
    type: FieldType;
    value: FieldValue;
}

export interface ObjectValue {
    [fieldName: string]: Field;
}

export interface Field extends TypeValuePair {
    name: string;
    label: string;
}

export interface TypeValuePair {
    type: FieldType;
    value: FieldValue;
}

export interface AuthContext {
    _id: string;
    type: 'user' | 'app' | 'localapp';
}