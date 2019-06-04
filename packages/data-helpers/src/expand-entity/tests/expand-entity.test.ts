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
    it('should convert successfully', async () => {
        expect(expandEntity(entity)).toMatchSnapshot()
    });
});