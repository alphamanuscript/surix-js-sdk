import { ApiEntity } from '../../types';
import { EntityWrapper } from '../entity-wrapper';

describe('EntityWrapper', () => {
  let entity: ApiEntity;
  let wrapped: EntityWrapper;
  beforeEach(() => {
    entity = {
      _id: 'entity1',
      data: {
        title: {
          type: 'text',
          name: 'title',
          label: 'Title',
          value: 'My Title'
        },
        active: {
          type: 'boolean',
          name: 'active',
          label: 'Active',
          value: false
        },
        count: {
          type: 'number',
          name: 'count',
          label: 'Count',
          value: '100'
        },
        address: {
          type: 'object',
          name: 'string',
          label: 'Address',
          value: {
            city: {
              type: 'text',
              name: 'city',
              label: 'City',
              value: 'Nairobi'
            },
            street: {
              type: 'text',
              name: 'street',
              label: 'Street',
              value: 'Some street'
            },
            landmarks: {
              type: 'list',
              label: 'Landmarks',
              name: 'landmarks',
              value: [
                  { type: 'text', value: 'Near historical monument' }
              ]
            }
          }
        },
        lastSeen: {
          type: 'datetime',
          name: 'lastSeen',
          label: 'Last seen',
          value: '2018-11-22T09:19:33.885Z'
        },
        image: {
          type: 'file',
          name: 'image',
          label: 'Image',
          value: {
            ref: 'file1',
            mimeType: 'image/jpeg',
            downloadUrl: 'download'
          }
        },
        misc: {
          type: 'list',
          name: 'misc',
          label: 'Misc',
          value: [
            {
              type: 'file',
              value: {
                ref: 'file2',
                mimeType: 'application/pdf',
                downloadUrl: 'download2'
              }
            }
          ]
        }
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
    describe('when target field is text', () => {
      it('should return the string value', () => {
        expect(wrapped.value('title')).toBe(entity.data.title.value);
      });
    });

    describe('dotted field paths', () => {
      it('should support dot notation for nested fields', () => {
        expect(wrapped.value('address.city')).toEqual('Nairobi');
      });
    });
    describe('array field paths', () => {
      it('should treat array items as nested path segments', () => {
        expect(wrapped.value(['address', 'city'])).toEqual('Nairobi');
      });
      it('should support singleton arrays', () => {
        expect(wrapped.value(['title'])).toEqual(entity.data.title.value);
      });
    });
  });
});