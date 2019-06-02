import { DataField, Entity, RawEntity, RawEntityData } from '../types';

function expandEntity (entity: Entity): RawEntity {
    const { data, tags } = entity;
    const convertedData = expandEntityData(data);
    // @ts-ignore
    return { data: convertedData, tags };
}

function expandEntityData (data: DataField): RawEntityData {
    const expandedEntity = Object.keys(data)
        .reduce((expanded, key) => {
        let converted = {};
        switch(typeof data[key]) {
            case 'object':
                converted = {
                    type: 'object',
                    // @ts-ignore 
                    value: expandEntityData(data[key])
                };
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