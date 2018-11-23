# @surix/data-util

This library implements a set of utilities and wrappers that make it easier to work with data objects from the Surix API (e.g. entities).

These wrappers are used by the official client libraries to abstract away the raw Surix API data from the developer.

## Usage

### `EntityWrapper` class

```javascript
import { EntityWrapper } from '@surix/data-util';

const raw = getRawEntityFromApi();
const wrapped = new EntityWrapper(raw);

const code = wrapped.value('address.country.code', 'KE');

// using raw entity, to avoid getting 'undefined' errors, we have to check whether each field exists
const codeFromRaw = raw.data.address
  && raw.data.address.value.country
  && raw.data.address.country.value.code
  && raw.data.address.country.value.code.value || 'KE';
```