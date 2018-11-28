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

export type FieldOrValuePair = Field | TypeValuePair;
export type NullableFieldOrValuePair = FieldOrValuePair | undefined;

export interface WrappedEntity {
    _id: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: AuthContext;
    tags: string[];
    rawEntity: ApiEntity;
    /**
     * returns the plain value of the field at the specified path
     * @param fieldPath the key of the field, this can be a
     * dotted string "field.nestedField" or an array ["field", "nestedField"]
     * the path can include field names as well as array indices
     * @param defaultValue 
     */
    get (fieldPath: string | FieldPathArray, defaultValue?: any): any;
    /**
     * returns the type of the field with the specified key
     * @param fieldPath the key of the field, this can be a
     * dotted string "field.nestedField" or an array ["field", "nestedField"]
     * the path can include field names as well as array indices
     * @param defaultType the type to return if the entity does not have the field
     */
    type (fieldPath: string | FieldPathArray, defaultType?: FieldType): FieldType|undefined;
    /**
     * returns the label of the field with the specified key
     * @param fieldPath the key of the field, this can be a
     * dotted string "field.nestedField" or an array ["field", "nestedField"]
     * the path can include field names as well as array indices
     * @param defaultLabel the label to return if the field does not exist
     */
    label (fieldPath: string | FieldPathArray, defaultLabel?: string): string|undefined;
    /**
     * returns the raw field at the specified key
     * @param fieldPath the key of the field, this can be a
     * dotted string "field.nestedField" or an array ["field", "nestedField"]
     * the path can include field names as well as array indices
     * @param defaultField the type to return if the entity does not have the field
     */
    field (fieldPath: string | FieldPathArray, defaultField?: FieldOrValuePair):
        NullableFieldOrValuePair;
    /**
     * returns the entity data
     * as plain (deflated) key-value pair
     */
    data (): object;
}

export interface ApiFile {
    _id: string;
    name: string;
    filename: string;
    status: 'pending' | 'failed' | 'ready';
    size: number;
    mimeType: string;
    public: boolean;
    tags: string[];
    uploadUrl: string;
    downloadUrl: string;
    createdBy: AuthContext;
    createdAt: string;
    updatedAt: string;
}

export interface WrappedFile {
    _id: string;
    id: string;
    name: string;
    filename: string;
    status: 'pending' | 'failed' | 'ready';
    size: number;
    mimeType: string;
    public: boolean;
    tags: string[];
    uploadUrl: string;
    downloadUrl: string;
    createdBy: AuthContext;
    createdAt: Date;
    updatedAt: Date;
    rawFile: ApiFile;
}