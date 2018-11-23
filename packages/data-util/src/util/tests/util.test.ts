import * as util from '../util';

import { ApiEntity, Field, ObjectValue } from '../../types';

describe('util', () => {
  describe('makeField', () => {
    it('should create a field based on the give value and metadata', () => {
      const field = util.makeField('value', 'text', 'name', 'Label');
      expect(field).toEqual({
        name: 'name',
        label: 'Label',
        type: 'text',
        value: 'value'
      });
    });
  });

  describe('dehydrateValue', () => {
    describe('when value type is text', () => {
      it('should return the string text value', () => {
        expect(util.dehydrateValue('value', 'text')).toBe('value');
      });
    });
    describe('when value type is boolean', () => {
      it('should return the boolean value', () => {
        expect(util.dehydrateValue(true, 'boolean')).toBe(true);
      });
    });
    describe('when value type is number', () => {
      it('should the value cast to Number', () => {
        expect(util.dehydrateValue('120', 'number')).toBe(120);
      });
    });
    describe('when value type is datetime', () => {
      it('should the value cast to a Date', () => {
        const value = '2017-02-22T09:19:33.885Z';
        expect(util.dehydrateValue(value, 'datetime')).toEqual(new Date(value));
      });
    });
    describe('when value type is file', () => {
      it('should return the same file value', () => {
        const value = {
          ref: 'file21',
          mimeType: 'image/png',
          downloadUrl: '/download'
        };
        expect(util.dehydrateValue(value, 'file')).toEqual(value);
      });
    });
    describe('when value type is object', () => {
      it('should convert the value to plain object values without field metadata', () => {
        const value = {
          title: util.makeField('My Title', 'text', 'title', 'Title'),
          read: util.makeField(true, 'boolean', 'read', 'Read'),
          cover: util.makeField({
            ref: 'file1',
            mimeType: 'image/jpeg',
            downloadUrl: 'download1'
          }, 'file', 'cover', 'Cover')
        };
        expect(util.dehydrateValue(value, 'object')).toEqual({
          title: 'My Title',
          read: true,
          cover: {
            ref: 'file1',
              mimeType: 'image/jpeg',
              downloadUrl: 'download1'
          }
        });
      });
    });
    describe('when value type is list', () => {
      it('should convert value to plain array of values without field metadata', () => {
        const value = [
          { type: 'text', value: 'test' },
          { type: 'number', value: '300' },
          { type: 'datetime', value: '2017-02-22T09:19:33.885Z' },
          { type: 'file', 
            value: { ref: 'file32', mimeType: 'text/plain', downloadUrl: 'download' } }
        ];
        expect(util.dehydrateValue(value, 'list')).toEqual([
          'test', 300, new Date('2017-02-22T09:19:33.885Z'),
          { ref: 'file32', mimeType: 'text/plain', downloadUrl: 'download' }
        ]);
      });
    });
    describe('when value is complex nested object', () => {
      it('should recursively convert value to plain object without field metadata', () => {
        const value = {
          foo: util.makeField({
            bar: util.makeField({
              baz: util.makeField('abc', 'text', 'baz', 'Baz'),
              baq: util.makeField('20', 'number', 'baq', 'Baq'),
              buz: util.makeField(false, 'boolean', 'buz', 'Buz'),
              bez: util.makeField('2018-02-22T09:19:33.885Z', 'datetime', 'bez', 'Bez'),
              bat: util.makeField(
                { ref: 'f2', mimeType: 'image/png', downloadUrl: 'down1' },
                'file', 'bat', 'Bat')
            }, 'object', 'bar', 'Bar'),
          },'object', 'foo', 'Foo'),
          biz: util.makeField([
            { type: 'boolean', value: true },
            { type: 'text', value: 'xyz' },
            { type: 'datetime', value: '2018-02-24T09:20:33.885Z' },
            { type: 'number', value: '342.234' },
            { type: 'file', value: {
              ref: 'f3',
              mimeType: 'image/jpeg',
              downloadUrl: 'down3'
            } },
            { type: 'object', value: {
              fizz: util.makeField('buzz', 'text', 'fizz', 'Fizz' )
            } }
          ], 'list', 'biz', 'Biz')
        };
        expect(util.dehydrateValue(value, 'object')).toMatchSnapshot();
      });
    });
  });

  describe('walkFieldPath', () => {
    let objField: Field;

    beforeEach(() => {
      objField = util.makeField({
        foo: util.makeField({
          fizz: util.makeField('buzz', 'text', 'fizz', 'Fizz')
        }, 'object', 'foo', 'Foo'),
        bar: util.makeField('bar value', 'text', 'bar', 'Bar'),
        rabs: util.makeField([
          {
            type: 'boolean',
            value: true
          },
          {
            type: 'object',
            value: {
              dar: util.makeField('dar value', 'text', 'dar', 'Dar')
            }
          }
        ], 'list', 'rabs', 'Rabs')
      }, 'object', 'name', 'label');
    });

    describe('when the start field has type object', () => {
      it('should return nested field (fizz) at the specified path', () => {
        const res = util.walkFieldPath(objField, ['foo', 'fizz']);
        expect(res).toMatchSnapshot();
      });
      it('should walk through array indices and return dar field', () => {
        const res = util.walkFieldPath(objField, ['rabs', '1', 'dar']);
        expect(res).toMatchSnapshot();
      });
      it('should support array indices as ints (returns dar field)', () => {
        const res = util.walkFieldPath(objField, ['rabs', 1, 'dar']);
        expect(res).toMatchSnapshot();
      });
    });
    describe('when the start field is a list', () => {
      it('should return nested list item (returns boolean item)', () => {
        const value = objField.value as ObjectValue;
        const res = util.walkFieldPath(value.rabs, [0]);
        expect(res).toMatchSnapshot();
      });
      it('should return walk nested object and return dar field', () => {
        const value = objField.value as ObjectValue;
        const res = util.walkFieldPath(value.rabs, [1, 'dar']);
        expect(res).toMatchSnapshot();
      });
    });
    describe('when path is empty', () => {
      it('should return the input field', () => {
        const res = util.walkFieldPath(objField, []);
        expect(res).toEqual(objField);
      });
    });
    describe('when the path cannot be matched', () => {
      it('should return undefined', () => {
        expect(util.walkFieldPath(objField, ['foo', 'fizz', 'unknown'])).toBeUndefined();
        expect(util.walkFieldPath(objField, ['foo', 'unknown', 'fizz'])).toBeUndefined();
        expect(util.walkFieldPath(objField, ['random', 'path'])).toBeUndefined();
      });
      it('should return undefined when using array index out of bound', () => {
        expect(util.walkFieldPath(objField, ['rabs', 2, 'dar'])).toBeUndefined();
      });
    });
  });

  describe('walkEntityPath', () => {
    let entity: ApiEntity;
    beforeEach(() => {
      entity = {
        _id: 'e1',
        createdAt: '2018-02-22T09:19:33.885Z',
        updatedAt: '2018-02-22T09:19:33.885Z',
        createdBy: {
          _id: 'u1',
          type: 'user'
        },
        tags: [],
        data: {
          foo: util.makeField({
            fizz: util.makeField('buzz', 'text', 'fizz', 'Fizz')
          }, 'object', 'foo', 'Foo'),
          bar: util.makeField('bar value', 'text', 'bar', 'Bar'),
          rabs: util.makeField([
            {
              type: 'boolean',
              value: true
            },
            {
              type: 'object',
              value: {
                dar: util.makeField('dar value', 'text', 'dar', 'Dar')
              }
            }
          ], 'list', 'rabs', 'Rabs')
        }
      };
    });
    it('should call walkFieldPath with the first field (returns dar field)', () => {
      const res = util.walkEntityPath(entity, ['rabs', 1, 'dar']);
      expect(res).toMatchSnapshot();
    });
    describe('when key in the path is not in entity', () => {
      it('should return undefined', () => {
        expect(util.walkEntityPath(entity, ['dabs', 1, 'dar'])).toBeUndefined();
        expect(util.walkEntityPath(entity, ['rabs', 2, 'dar'])).toBeUndefined();
        expect(util.walkEntityPath(entity, ['foo', 'barred'])).toBeUndefined();
      });
    });
    describe('when path is empty', () => {
      it('should return undefined', () => {
        expect(util.walkEntityPath(entity, [])).toBeUndefined();
      });
    });
  });
});