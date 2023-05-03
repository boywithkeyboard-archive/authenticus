## authenticus

### Setup

#### Deno

```ts
import { GitHub } from 'https://deno.land/x/authenticus@v0.1.0/mod.ts'
```

#### Node.js

```bash
npm i authenticus
```

```ts
import { GitHub } from 'authenticus'
```

### Usage

```ts
const loginUrl = GitHub.login()
```

### Presets

#### Official

- `Amazon` ✔️
- `Apple` ✔️
- `Discord` ✔️
- `GitHub` ✔️
- `Google` ✔️
- `Instagram` ✔️
- `LinkedIn` ✔️
- `Microsoft` ✔️
- `Pinterest` ✔️
- `Reddit` ✔️
- `Slack` ✔️
- `Spotify` ✔️
- `Steam` ✔️
- `Telegram` ✔️
- `Twitch` ✔️
- `Twitter` ✔️

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
