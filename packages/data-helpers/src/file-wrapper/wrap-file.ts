import { ApiFile, WrappedFile } from '../types';

export function wrapFile (file: ApiFile): WrappedFile {
  return {
    ...file,
    id: file._id,
    createdAt: new Date(file.createdAt),
    updatedAt: new Date(file.updatedAt)
  };
}

export function wrapFileArray (files: ApiFile[]): WrappedFile[] {
  return files.map(wrapFile);
}