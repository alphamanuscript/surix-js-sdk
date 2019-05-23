import { ApiEntity } from '../../types';
import { wrapEntity, wrapEntityArray } from '../entity-wrapper';

import * as util from '../../util';

describe('wrapEntity', () => {
  it('should transform entity into an EntityWrapper', () => {
    const entity: ApiEntity = {
      _id: 'ent1',
      data: {
        name: util.makeField('Foo', 'text')
      },
      createdBy: {
        _id: 'u1',
        type: 'user'
      },
      updatedBy: {
        _id: 'u2',
        type: 'user'
      },
      createdAt: '2017-02-22T09:19:33.885Z',
      updatedAt: '2018-10-22T09:19:33.885Z',
      tags: ['t1', 't2']
    };
    const wrapped = wrapEntity(entity);
    expect(wrapped).toMatchSnapshot();
  });
});

describe('wrapEntityArray', () => {
  it('should transform an array of entities into an array of EntityWrapper', () => {
    const entities: ApiEntity[] = [
      {
        _id: 'ent1',
        data: {
          name: util.makeField('Foo', 'text')
        },
        createdBy: {
          _id: 'u1',
          type: 'user'
        },
        updatedBy: {
          _id: 'u2',
          type: 'user'
        },
        createdAt: '2017-02-22T09:19:33.885Z',
        updatedAt: '2018-10-22T09:19:33.885Z',
        tags: ['t1', 't2']
      },
      {
        _id: 'ent2',
        data: {
          name: util.makeField('Bar', 'text')
        },
        createdBy: {
          _id: 'u2',
          type: 'user'
        },
        updatedBy: {
          _id: 'u3',
          type: 'user'
        },
        createdAt: '2017-02-23T09:19:33.885Z',
        updatedAt: '2018-10-23T09:19:33.885Z',
        tags: ['t1', 't2']
      }
    ];
    const wrapped = wrapEntityArray(entities);
    expect(wrapped).toMatchSnapshot();
  });
});