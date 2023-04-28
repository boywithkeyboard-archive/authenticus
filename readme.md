## authenticus

### Setup

#### Deno

```ts
import authenticus, { GitHub } from 'https://deno.land/x/authenticus@v0.1.0/mod.ts'
```

#### Node.js

```bash
npm i authenticus
```

```ts
import authenticus, { GitHub } from 'authenticus'
```

### Usage

```ts
const oauth2 = new authenticus()
  .use(GitHub)

const loginUrl = oauth2.getLoginUrl()
```

### Presets

#### Official

- `Discord`
- `GitHub`
- `Microsoft`
- `Spotify`

[*Don't see the preset you need? Request it!*]()

#### Custom

```ts
import authenticus, { Preset } from 'authenticus'

const customPreset: Preset = [
  'custom',
  {
    authorize_hostname: 'example.com',
    authorize_pathname: '/oauth2/authorize',
    token_hostname: 'example.com',
    token_pathname: '/oauth2/token'
  }
]

const oauth2 = new authenticus()
  .use(customPreset)
```
