import { EntityWrapper } from '../entity-wrapper';

describe('EntityWrapper', () => {
    let entity: any;
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
                }
            },
            createdAt: new Date(2010, 10, 20),
            updatedAt: new Date(2010, 10, 10),
            createdBy: {
                _id: 'user1',
                type: 'user'
            },
            tags: ['posts']
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
});