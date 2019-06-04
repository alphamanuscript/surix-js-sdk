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
                const isArray = Array.isArray(data[key]);
                converted = {
                    type: isArray ? 'list' : 'object',
                    // @ts-ignore
                    value: isArray ? 
                        // @ts-ignore
                        data[key].map(item => expandEntityData(item)) : 
                        // @ts-ignore
                        expandEntityData(data[key])
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