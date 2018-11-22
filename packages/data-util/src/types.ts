export class ApiEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
    data: ObjectValue;
    createdBy: AuthContext;
    tags: string[];
}

export type FieldType = 'text' | 'boolean' | 'number' | 'datetime'
    | 'file' | 'object' | 'list';

export type FieldValue = string | boolean | ListItemValue[] | ObjectValue;

export interface ListItemValue {
    type: FieldType;
    value: FieldValue;
}

export interface ObjectValue {
    [fieldName: string]: {
        name: string;
        type: FieldType;
        label: string;
        value: FieldValue;
    };
}

export interface AuthContext {
    _id: string;
    type: 'user' | 'app' | 'localapp';
}