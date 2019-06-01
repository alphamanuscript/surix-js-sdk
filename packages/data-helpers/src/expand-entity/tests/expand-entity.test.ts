import { expandEntity } from '../expand-entity';

describe('ExpandEntity', () => {
    let entity;

    beforeAll(async () => {
        entity = {
            data: {
                name: 'Kevin Nderitu',
                age: 12,
                address: {
                    location: 'Nairobi'
                }
            }
        };
    });
    it('should be a function', async () => {
        expect(expandEntity).toBeInstanceOf(Function);
    });
    it('should convert successfully', async () => {
        const expected = {
            data: {
                name: {
                    type: 'text',
                    value: entity.data.name
                },
                age: {
                    type: 'number',
                    value: entity.data.age
                },
                address: {
                    type: 'object',
                    value: {
                        location: {
                            type: 'text',
                            value: entity.data.address.location
                        }
                    }
                }
            }
        };
        expect(expandEntity(entity)).toEqual(expected)
    });
});