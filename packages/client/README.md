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

Create Client for the staging server

```javascript
const client = new Client({ environment: 'staging' });
```

Use custom base URL

```javascript
const client = new Client({ baseUrl: 'https://mydomain.com/api' });
```

Authenticate

```javascript
await client.authenticate({ email: 'me@email.com', password: 'strong password' });
// Continue using client

// Or
client.authenticate({
  email: 'me@email.com',
  password: 'strong password'
}).then(authenticatedClient => {
  // Continue using authenticatedClient
})
```

Select project to work with:

```javascript
const project = client.project('projectId');
```

### Entities

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
