# @surix/data-helpers

This library implements a set of utilities and wrappers that make it easier to work with data objects from the Surix API (e.g. entities).

These wrappers are used by the official client libraries to abstract away the raw Surix API data from the developer.

## Installation

```
npm install --save @surix/data-helpers
```

or

```
yarn add @surix/data-helpers
```

## Usage

```javascript
import { 
  wrapEntity,
  wrapEntityArray,
  wrapFile,
  wrapFileArray
} from '@surix/data-helpers'
```
or:

```javascript
const {
  wrapEntity,
  wrapEntityArray,
  wrapFile,
  wrapFileArray
} = require('@surix/data-helpers')
```

### `wrapEntity`

```javascript
import { wrapEntity } from '@surix/data-helpers';

const raw = getRawEntityFromApi();
const wrappedEntity = new wrapEntity(raw);

const code = wrappedEntity.get('address.country.code', 'KE');

// using raw entity, to avoid getting 'undefined' errors, we have to check whether each field exists
const codeFromRaw = raw.data.address
  && raw.data.address.value.country
  && raw.data.address.country.value.code
  && raw.data.address.country.value.code.value || 'KE';
```

#### methods

- `wrappedEntity.get(key, defaultValue?)`: returns plain value of the specified field
- `wrappedEntity.type(key, defaultType?)`: returns type of the specified field
- `wrappedEntity.field(key, defaultType?)`: returns the raw field with the specified key
- `wrappedEntity.label(key, defaultLabel?)`: return the label of the specified field
- `wrappedEntity.data()`: returns the data of the entity as a plain key-value object (without field metadata)

#### properties
You can access the top-level properties of the entity directly:
- `wrappedEntity._id` (or `id`)
- `wrappedEntity.tags`
- `wrappedEntity.createdAt`
- `wrappedEntity.updatedAt`
- `wrappedEntity.createdBy`
- `wrappedEntity.rawEntity`: Returns the raw entity from the API