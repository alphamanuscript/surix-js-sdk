import { DataField, Entity, RawEntity, RawEntityData } from '../types';

/**
 * This file requires SERIOUS refactoring
 * Refactoring this should be a tecnical debt
 */

/**
 * Converts user entity to system entity by populating the fields with types
 * @param {Entity} entity 
 */
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
                        value: expandArrayValue(data[key])
                    };
                //@ts-ignore
                } else if (typeof data[key].getMonth === 'function') {
                    converted = {
                        type: 'datetime',
                        value: data[key]
                    };
                } else {
                    converted = {
                        type: 'object',
                        // @ts-ignore
                        value: expandEntityData(data[key])
                    };
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

function expandArrayValue(value: any[]): any[] {
    let values: any[] = [];
    value.forEach((item: number | string | boolean | DataField) => {
        switch (typeof item) {
            case 'object':
                if(Array.isArray(item)) {
                    values.push(expandArrayValue(item));
                } else if (typeof item.getMonth === 'function') {
                    values.push({
                        type: 'datetime',
                        value: item
                    });
                }else {
                    values.push(expandEntityData(item));
                }
                break;
            case 'string':
                values.push({
                    type: 'text',
                    value: item
                });
                break;
            default:
                values.push({
                    type: typeof item,
                    value: item
                });

        }
    });
    return values;
}

export {
    expandEntity
};