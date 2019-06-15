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
                petsAges: [1, 2, 4],
                isOldEnough: true
            },
            tags: ['sometag'],
            _id: 'thisisanid'
        };
    });
  
    it('should convert successfully', async () => {
        expect(expandEntity(entity)).toMatchSnapshot();
    });
});