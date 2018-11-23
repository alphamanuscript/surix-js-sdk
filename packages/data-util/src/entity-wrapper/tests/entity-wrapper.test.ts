import * as util from '../../util';

import { ApiEntity } from '../../types';
import { EntityWrapper } from '../entity-wrapper';

describe('EntityWrapper', () => {
  let entity: ApiEntity;
  let wrapped: EntityWrapper;
  beforeEach(() => {
    entity = {
      _id: 'entity1',
      data: {
        title: util.makeField('My Title', 'text', 'title', 'Title'),
        active: util.makeField(false, 'boolean', 'active', 'Active'),
        count: util.makeField('100', 'number', 'count', 'Count'),
        address: util.makeField({
          city: util.makeField('Nairobi', 'text', 'city', 'City'),
          street: util.makeField('Some street', 'text', 'street', 'Street'),
          landmarks: util.makeField([
            { type: 'text', value: 'Near historical monument' }
          ], 'list', 'landmarks', 'Landmarks')
        }, 'object', 'address', 'Address'),
        lastSeen: util.makeField('2018-11-22T09:19:33.885Z', 'datetime', 'lastSeen', 'Last seen'),
        image: util.makeField({
          ref: 'file1',
          mimeType: 'image/jpeg',
          downloadUrl: 'download'
        }, 'file', 'image', 'Image'),
        misc: util.makeField([
          {
            type: 'file',
            value: {
              ref: 'file2',
              mimeType: 'application/pdf',
              downloadUrl: 'download2'
            }
          },
          { type: 'number', value: '223.45' },
          { type: 'object', value: {
            foo: util.makeField('bar', 'text', 'foo', 'Foo')
          }}
        ], 'list', 'misc', 'Misc')
      },
      createdAt: '2017-02-22T09:19:33.885Z',
      updatedAt: '2018-10-22T09:19:33.885Z',
      createdBy: {
        _id: 'user1',
        type: 'user'
      },
      tags: ['posts', 'stuff']
    };
    wrapped = new EntityWrapper(entity);
  });

  describe('top-level entity metadata', () => {
    it('should offer direct access _id, tags, createdBy properties', () => {
      expect(wrapped._id).toEqual(entity._id);
      expect(wrapped.tags).toEqual(entity.tags);
      expect(wrapped.createdBy).toEqual(entity.createdBy);
    });
    it('should return timestamps properties converted to Date objects', () => {
      expect(wrapped.createdAt).toEqual(new Date(entity.createdAt));
      expect(wrapped.updatedAt).toEqual(new Date(entity.updatedAt));
    });
  });

  describe('rawEntity', () => {
    it('should return the wrapped raw entity', () => {
      expect(wrapped.rawEntity).toEqual(entity);
    });
  });

  describe('value', () => {
    describe('when path is provided', () => {
      it('should find the field using util.walkEntityPath on the raw entity', () => {
        const spy = jest.spyOn(util, 'walkEntityPath');
        wrapped.get(['address', 'landmarks']);
        expect(spy.mock.calls).toMatchSnapshot();
      });
      it('should convert the field to plain object using util.dehydrateValue', () => {
        const spy = jest.spyOn(util, 'dehydrateValue');
        wrapped.get(['address', 'landmarks']);
        expect(spy.mock.calls).toMatchSnapshot();
      });
      it('should return the dehydrated plain value', () => {
        const res = wrapped.get(['address', 'landmarks']);
        expect(res).toMatchSnapshot();
      });
    });
    describe('when string path is provided', () => {
      it('should split string path to array', () => {
        const spy = jest.spyOn(util, 'walkEntityPath');
        const stringPath = 'address.city';
        const arrayPath = ['address', 'city'];
        wrapped.get(stringPath);
        expect(spy).toHaveBeenCalledWith(entity, arrayPath);
      });
      it('should turn empty string to empty array', () => {
        const spy = jest.spyOn(util, 'walkEntityPath');
        wrapped.get('');
        expect(spy).toHaveBeenCalledWith(entity, []);
      });
      it('should turn non-dotted string as a single key array', () => {
        const spy = jest.spyOn(util, 'walkEntityPath');
        wrapped.get('address');
        expect(spy).toHaveBeenCalledWith(entity, ['address']);
      });
      it('should return the same result as with an array path', () => {
        const res = wrapped.get('address.landmarks');
        expect(res).toMatchSnapshot();
      });
    });
    describe('when the key path cannot be matched', () => {
      it('should return undefined', () => {
        const res = wrapped.get('unknown.path');
        expect(res).toBeUndefined();
      });
    });
    describe('when the path is empty', () => {
      it('should return undefined', () => {
        const res = wrapped.get('');
        expect(res).toBeUndefined();
      });
    });
    describe('when default value is provided', () => {
      it('returns default value if path cannot be matched', () => {
        const res = wrapped.get('unknown.path', 'test');
        expect(res).toBe('test');
      });
      it('returns plain field value if path is matched', () => {
        const res = wrapped.get('address.city', 'test');
        expect(res).toBe('Nairobi');
      });
      it('returns default value if path is empty', () => {
        const res = wrapped.get('', 'test');
        expect(res).toBe('test');
      });
    });
  });

  describe('data', () => {
    it('should return data converted to plain dehydrated object', () => {
      const spy = jest.spyOn(util, 'dehydrateValue');
      const res = wrapped.data();
      expect(res).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith(entity.data, 'object');
    });
    it('should cache the converted data and not call util.dehydrateEachTime', () => {
      const mockData = { title: 'Title' };
      jest.restoreAllMocks();
      const spy = jest.spyOn(util, 'dehydrateValue').mockReturnValue(mockData);
      const first = wrapped.data();
      const second = wrapped.data();
      expect(first).toEqual(mockData);
      expect(second).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('type', () => {
    it('should return the type of the field at the specified path', () => {
      const type = wrapped.type('address.landmarks');
      expect(type).toEqual('list');
    });
    it('should return undefined if the path cannot be matched', () => {
      const type = wrapped.type('address.unknown.landmarks');
      expect(type).toBeUndefined();
    });
    describe('when a default is provided', () => {
      it('should return the default if the path cannot be matched', () => {
        const type = wrapped.type('address.unknown.landmarks', 'text');
        expect(type).toBe('text');
      });
      it('should return the true type if the the path is matched', () => {
        const type = wrapped.type('address.landmarks', 'boolean');
        expect(type).toBe('list');
      });
    });
  });

  describe('field', () => {
    it('should return the raw field (list of landmarks)', () => {
      const field = wrapped.field('address.landmarks');
      expect(field).toMatchSnapshot();
    });
    it('should return undefined if the path cannot be matched', () => {
      const field = wrapped.field('address.unknown.landmarks');
      expect(field).toBeUndefined();
    });
    describe('when a default is provided', () => {
      it('should return the default if the path cannot be matched', () => {
        const defField = util.makeField('test', 'text', 'name', 'label');
        const field = wrapped.field('address.unknown.landmarks', defField);
        expect(field).toEqual(defField);
      });
      it('should return the true (list of landmarks) field if the the path is matched', () => {
        const defField = util.makeField('test', 'text', 'name', 'label');
        const field = wrapped.field('address.landmarks', defField);
        expect(field).toMatchSnapshot();
      });
    });
  });

  describe('label', () => {
    it('should return the label of the field at the specified path', () => {
      const label = wrapped.label('address.landmarks');
      expect(label).toEqual('Landmarks');
    });
    it('should return undefined if the field at the path does not have a label', () => {
      const label = wrapped.label('address.landmarks.0');
      expect(label).toBeUndefined();
    });
    it('should return undefined if the path cannot be matched', () => {
      const label = wrapped.label('address.unknown.landmarks');
      expect(label).toBeUndefined();
    });
    describe('when a default is provided', () => {
      it('should return the default if the path cannot be matched', () => {
        const label = wrapped.label('address.unknown.landmarks', 'Label');
        expect(label).toBe('Label');
      });
      it('should return the default if the field at the path does not have a label', () => {
        const label = wrapped.label('address.landmarks.0', 'Label');
        expect(label).toBe('Label');
      });
      it('should return the true label if the the path is matched', () => {
        const label = wrapped.label('address.landmarks', 'boolean');
        expect(label).toBe('Landmarks');
      });
    });
  });
});