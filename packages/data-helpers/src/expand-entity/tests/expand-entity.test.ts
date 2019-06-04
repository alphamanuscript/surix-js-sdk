import { expandEntity } from '../expand-entity';

describe('ExpandEntity', () => {
    let entity;

    beforeAll(async () => {
        entity = {
            data: {
                name: 'Kevin Nderitu',
                age: 12,
                birthDate: new Date('1-1-1999'),
                address: {
                    location: 'Nairobi'
                },
                children: [
                    {
                        name: 'First son'
                    },
                    {
                        name: 'Second daughter'
                    }
                ],
                isOldEnough: true
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
                },
                children: {
                    type: 'list',
                    value: [
                        {
                            name: {
                                type: 'text',
                                value: 'First son'
                            }
                        },
                        {
                            name: {
                                type: 'text',
                                value: 'Second daughter'
                            }
                        }
                    ]
                },
                birthDate: { 
                    type: 'datetime', 
                    value: new Date('1-1-1999')
                },
                isOldEnough: {
                    type: 'boolean',
                    value: true
                }
            }
        };
        // @ts-ignore
        expect(expandEntity(entity)).toEqual(expected)
    });
});