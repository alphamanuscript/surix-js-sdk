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

### `EntityWrapper` class

```javascript
import { EntityWrapper } from '@surix/data-helpers';

const raw = getRawEntityFromApi();
const wrapped = new EntityWrapper(raw);

const code = wrapped.get('address.country.code', 'KE');

// using raw entity, to avoid getting 'undefined' errors, we have to check whether each field exists
const codeFromRaw = raw.data.address
  && raw.data.address.value.country
  && raw.data.address.country.value.code
  && raw.data.address.country.value.code.value || 'KE';
```

#### methods

- `get(key, defaultValue?)`: returns plain value of the specified field
- `type(key, defaultType?)`: returns type of the specified field
- `field(key, defaultType?)`: returns the raw field with the specified key
- `label(key, defaultLabel?)`: return the label of the specified field
- `data()`: returns the data of the entity as a plain key-value object (without field metadata)

#### properties
You can access the top-level properties of the entity directly:
- `_id` (or `id`)
- `tags`
- `createdAt`
- `updatedAt`
- `createdBy`