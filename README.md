# Excuz

A CLI and library that returns random humorous developer excuses in multiple languages.

## CLI Usage

```bash
npx excuz              # Random excuse (default: English)
npx excuz -l bn        # Random Bengali excuse
npx excuz --lang en    # Random English excuse
npx excuz list         # List all excuses
npx excuz count        # Get count of excuses
npx excuz i            # Interactive mode
```

## Library Usage

Install the package:

```bash
npm install excuz
```

Use it in your code:

```javascript
import { getRandomExcuse, getAllExcuses, getExcuseCount, DEFAULT_LANGUAGE } from 'excuz';

// Get a random excuse (default: English)
const excuse = getRandomExcuse();
console.log(excuse);

// Get a random Bengali excuse
const bnExcuse = getRandomExcuse('bn');
console.log(bnExcuse);

// Get all excuses
const allExcuses = getAllExcuses('en');
console.log(allExcuses);

// Get count of excuses
const count = getExcuseCount('bn');
console.log(count);
```

### TypeScript Support

```typescript
import { getRandomExcuse, type Language } from 'excuz';

const excuse: string = getRandomExcuse('en' as Language);
```

_"Excuz: When you need an excuse, we've got you covered."__
