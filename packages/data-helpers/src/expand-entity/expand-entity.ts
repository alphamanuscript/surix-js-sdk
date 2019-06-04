import { DataField, Entity, RawEntity, RawEntityData } from '../types';

function expandEntity (entity: Entity): RawEntity {
    const { data } = entity;
    const convertedData = expandEntityData(data);
    // delete entity.data;
    // @ts-ignore
    return { ...entity, data: convertedData };
}

function expandEntityData (data: DataField): RawEntityData {
    const expandedEntity = Object.keys(data)
        .reduce((expanded, key) => {
        let converted = {};
        switch(typeof data[key]) {
            case 'object':
                if(Array.isArray(data[key])) {
                    converted = {
                        type: 'list',
                        // @ts-ignore
                        value: data[key].map(item => expandEntityData(item))
                    };
                } else if (data[key] instanceof Date) {
                    converted = {
                        type: 'datetime',
                        value: data[key]
                    };
                } else {
                    converted = {
                        type: 'object',
                        // @ts-ignore
                        value: expandEntityData(data[key])
                    }
                }
                break;
            case 'string':
                converted = {
                    type: 'text',
                    value: data[key]
                };
            break;
            default:
                converted = { 
                    type: typeof data[key],
                    value: data[key]
                };
            break;
        }
        return { ...expanded, [key]: converted };
        }, {});
    return expandedEntity;
  }

export {
    expandEntity
};