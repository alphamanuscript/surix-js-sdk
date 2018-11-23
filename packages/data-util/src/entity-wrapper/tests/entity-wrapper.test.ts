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
    it('should return the plain value at the specified key path', () => {
      expect(wrapped.value('title')).toBe(entity.data.title.value);
    });
    it('should return the plain object at the specified key path', () => {
      expect(wrapped.value('address')).toMatchSnapshot();
    });
    it('should return the plain array at the specified key path', () => {
      expect(wrapped.value('misc')).toMatchSnapshot();
    });
    it('should call util.walkEntityPath to get value at key path', () => {
      const spy = jest.spyOn(util, 'walkEntityPath');
      wrapped.value(['misc', 2]);
      expect(spy.mock.calls).toMatchSnapshot();
    });
    describe('when string path is provided', () => {
      it('should split string path to array', () => {
        const spy = jest.spyOn(util, 'walkEntityPath');
        const stringPath = 'address.city';
        const arrayPath = ['address', 'city'];
        wrapped.value(stringPath);
        expect(spy).toHaveBeenCalledWith(entity, arrayPath);
      });
    });

    describe('dotted field paths', () => {
      it('should support dot notation for nested fields', () => {
        expect(wrapped.value('address.landmarks')).toMatchSnapshot();
      });
    });
    describe('array field paths', () => {
      it('should support array-based paths', () => {
        expect(wrapped.value(['address', 'city'])).toEqual('Nairobi');
      });
      it('should support singleton arrays', () => {
        expect(wrapped.value(['title'])).toEqual(entity.data.title.value);
      });
    });
    describe('when the path is empty string', () => {
      it('should return entity data as plain dehydrated object', () => {
        expect(wrapped.value('')).toMatchSnapshot();
      });
    });
    describe('when the path is empty array', () => {
      it('should return entity data as plain dehydrated object', () => {
        expect(wrapped.value([])).toMatchSnapshot();
      });
    });
    describe('when the path stops at an array index', () => {
      it('should return historical monument item', () => {
        expect(wrapped.value('address.landmarks.0')).toMatchSnapshot();
      });
      it('should return historical monument item when using array paths', () => {
        expect(wrapped.value(['address', 'landmarks', '0'])).toMatchSnapshot();
      });
      it('should return historical monument item when using array paths with integer index', () => {
        expect(wrapped.value(['address', 'landmarks', 0])).toMatchSnapshot();
      });
    });
    describe('when the path goes through an array index', () => {
      it('should return bar', () => {
        expect(wrapped.value('misc.2.foo')).toMatchSnapshot();
      });
      it('should return bar when using array paths', () => {
        expect(wrapped.value(['misc', '2', 'foo'])).toMatchSnapshot();
      });
      it('should return bar when using array paths with integer index', () => {
        expect(wrapped.value(['misc', 2, 'foo'])).toMatchSnapshot();
      });
    });
  });
});