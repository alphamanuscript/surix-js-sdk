# Surix Core Client

## Usage

```javascript
const { Client } = require('@surix/client');

// OR

import { Client } from '@surix/client';
```

Create Client instance:

```javascript
const client = new Client();
```

Create Client for the server

Use custom base URL

```javascript
const client = new Client({ 
  environment: 'staging', // staging or production
  baseUrl: 'https://mydomain.com/api', // custom server
  keyId: 'key id provided by surix',
  keySecret: 'key secret provided by surix'
  });
```

Note: `keyId` and `keySecret` are provided in the surix dashboard, under account settings.

Select project to work with:

```javascript
const project = client.project('projectId');
```

### Entities

#### `project.entities.create(entity: Entity)`

Creates a given entity

```javascript
const entity = {
  data: {
    name: 'My Awesome Name'
  },
  tags: []
}

const savedEntity = await project.entities.create(entity)

console.log(savedEntity.get('name'))
```

Note: Before the entity is created, it is expanded (using `expandEntity` function in `@surix/data-helpers`) to a raw entity that includes the types information using the type of the values provided in the data field.
The entity above would be converted to:

```javascript
{
  data: {
    name: {
      type: 'text',
      value: 'My Awesome Name'
    }
  },
  tags: []
}
```
Dates are expanded as `text` for now and will correctly be expanded to `datetime` in future versions of `@surix/data-helpers`. Arrays are not supported for now.


#### `project.entities.patch(entity: Entity)`

Updates a entity partially. I.e adds onto the already existing entity identified by the `_id` field.

```javascript
const entity = {
  _id: 'someid',
  data: {
    phone: '0712345678'
  },
  tags: ['tag']
}

const updatedEntity = await project.entities.patch(entity);
```

 Dates created with the `Date()` function are expanded as `text`. and those created with `new Date()` are correctly expanded to `datetime`.

#### `project.entities.put(entity: Entity)`

Updates an entity by completely replacing its data.

```javascript
const entity = {
  _id: 'someid', // The id of the entity to be updated
  data: {
    name: 'My name'
  }
}

const changedEntity = await project.entities.put(entity);

```
#### `project.entities.get(id: string)`

Fetches an entity by ID.

```javascript
const entity = await project.entities.get('entityId');
console.log(entity.tags);
console.log(entity.get('address.city'));
```

#### `project.entities.query(query?: object)`

Query entities in the project.

```javascript
const entities = await project.entities.query({
  limit: 10,
  tags: ['posts'],
  query: {
    read: false
  }
});

entities.forEach((entity) => {
  console.log(entity.get('contents'));
});
```

The query object is optional:

```javascript
const entities = await project.entities.query();

entities.forEach((entity) => {
  console.log(entity.get('contents'));
});
```

#### `project.entities.delete(id: string)`

Deletes an entity entirely.

```javascript
const entityId = 'someid';
const deletedEntity = await project.entities.delete(entityId);

console.log(deletedEntity.get('name') + ' was deleted');
```

#### `project.entities.deleteMany(ids: EntityIds)`

Deletes a bunch of entities identified by the provided ids.

```javascript
const entitiesIds = {
  entities: ['someid1', 'someid2']
}

const response = await project.entities.deleteMany(entitiesIds);
console.log(response.deleted); // Number of deleted entities
```

### Files

#### `project.files.get(id: string)`

Fetches a file by ID.

```javascript
const file = await project.files.get('fileId');
console.log(file.downloadUrl);
```

#### `project.files.list()`

Fetches all files in the project.

```javascript
const files = await.project.files.list();
files.forEach((file) => console.log(file.downloadUrl));
```

### Tags

#### `project.tags.list()`

Fetches all tags in project.

```javascript
const tags = await project.tags.list();
tags.forEach((tag) => console.log(tag.name));
```
