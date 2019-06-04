export class ApiEntity {
    _id: string;
    createdAt: string;
    updatedAt: string;
    data: ObjectValue;
    createdBy: AuthContext;
    updatedBy: AuthContext;
    tags: string[];
}

export interface EntitySingleDataField {
    type: FieldType;
    value: boolean | string | number | EntitySingleDataField | EntitySingleDataField[];
}

  /**
   * this interface describe the shape of the entity
   * as used within the system and the API
   */
export interface RawEntity {
    data: EntitySingleDataField;
    tags?: [string];
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
}

export interface TypeValuePair {
    type: FieldType;
    value: FieldValue;
}

export interface AuthContext {
    _id: string;
    type: 'user' | 'app';
}

export interface RawEntityData {
    [fieldName: string]: TypeValuePair;
}
export interface DataField {
    [fieldName: string]: string | number | object | boolean | DataField;
}
export interface Entity {
    data: DataField;
    tags?: string[];
}

export type FieldOrValuePair = Field | TypeValuePair;
export type NullableFieldOrValuePair = FieldOrValuePair | undefined;

export interface WrappedEntity {
    /**
     * unique id of the entity
     */
    _id: string;
    /**
     * unique id of the entity
     * @alias _id
     */
    id: string;
    /**
     * when the entity was created
     */
    createdAt: Date;
    /**
     * when the entity was last updated
     */
    updatedAt: Date;
    /**
     * user or app that created the entity;
     */
    createdBy: AuthContext;
    /**
     * user or app that updated the entity;
     */
    updatedBy: AuthContext;
    /**
     * list of tags the entity belongs to
     */
    tags: string[];
    /**
     * the origina entity object from the API
     */
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
    /**
     * unique id of the file
     */
    _id: string;
    /**
     * unique id of the file
     * @alias _id
     */
    id: string;
    /**
     * display name of the file
     */
    name: string;
    /**
     * filename of the file
     */
    filename: string;
    /**
     * status of the file, one of 
     * - 'pending': file upload not yet complete
     * - 'failed': file upload failed
     * - 'ready': upload complete, file can be downloaded
     */
    status: 'pending' | 'failed' | 'ready';
    /**
     * size of the file contents in bytes
     */
    size: number;
    /**
     * MIME type of the file
     */
    mimeType: string;
    /**
     * whether the file is allowed to be downloaded by the general public,
     * if set to true, the download url is fixed
     */
    public: boolean;
    /**
     * list of tags the file belongs to
     */
    tags: string[];
    /**
     * url to use when uploading the file contents
     */
    uploadUrl: string;
    /**
     * url to use for downloading the file
     */
    downloadUrl: string;
    /**
     * app or user that created the file
     */
    createdBy: AuthContext;
    /**
     * when the file was created
     */
    createdAt: Date;
    /**
     * when the file was last updated
     */
    updatedAt: Date;
    /**
     * the original file object from the API
     */
    rawFile: ApiFile;
}