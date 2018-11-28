import { ApiFile, WrappedFile } from '../types';

export function wrapFile (file: ApiFile): WrappedFile {
  return {
    ...file,
    id: file._id,
    createdAt: new Date(file.createdAt),
    updatedAt: new Date(file.updatedAt),
    get rawFile (): ApiFile {
      return file;
    }
  };
}

export function wrapFileArray (files: ApiFile[]): WrappedFile[] {
  return files.map(wrapFile);
}