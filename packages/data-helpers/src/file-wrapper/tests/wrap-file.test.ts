import { ApiFile } from '../../types';
import { wrapFile, wrapFileArray} from '../wrap-file';

describe('wrapFile', () => {
  let file: ApiFile;
  beforeEach(() => {
    file = {
      _id: 'f1',
      name: 'My File',
      filename: 'f1.jpeg',
      mimeType: 'image/jpeg',
      size: 246,
      status: 'ready',
      downloadUrl: 'http://download/f1',
      uploadUrl: 'http://upload/f1',
      public: true,
      tags: ['t1', 't2'],
      createdBy: {
        _id: 'f1',
        type: 'user'
      },
      createdAt: '2017-02-22T09:19:33.885Z',
      updatedAt: '2018-10-22T09:19:33.885Z',
    };
  });
  const wrap = () => wrapFile(file);
  it('should transform api file into WrappedFile', () => {
    expect(wrap()).toMatchSnapshot();
  });
  it('should return timestamps as actual Dates', () => {
    const wrapped = wrap();
    expect(wrapped.createdAt).toBeInstanceOf(Date);
    expect(wrapped.updatedAt).toBeInstanceOf(Date);
  });
  it('should have rawFile property that returns original ApiFile', () => {
    expect(wrap().rawFile).toEqual(file);
  });
});

describe('wrapFileArray', () => {
  it('should transform array of ApiFile into array of WrappedFile', () => {
    const files: ApiFile[] = [
      {
        _id: 'f1',
        name: 'My File',
        filename: 'f1.jpeg',
        mimeType: 'image/jpeg',
        size: 246,
        status: 'ready',
        downloadUrl: 'http://download/f1',
        uploadUrl: 'http://upload/f1',
        public: true,
        tags: ['t1', 't2'],
        createdBy: {
          _id: 'u1',
          type: 'user'
        },
        createdAt: '2017-02-22T09:19:33.885Z',
        updatedAt: '2018-10-22T09:19:33.885Z',
      },
      {
        _id: 'f2',
        name: 'My Other File',
        filename: 'f2.pdf',
        mimeType: 'application/pdf',
        size: 400,
        status: 'pending',
        downloadUrl: '',
        uploadUrl: 'http://upload/f2',
        public: false,
        tags: ['t1', 't2'],
        createdBy: {
          _id: 'u2',
          type: 'user'
        },
        createdAt: '2017-02-22T09:19:33.885Z',
        updatedAt: '2018-10-22T09:19:33.885Z',
      }
    ];
    const wrapped = wrapFileArray(files);
    expect(wrapped).toMatchSnapshot();
  });
});
