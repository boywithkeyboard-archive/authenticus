### Setup

```bash
npm i authenticus
```

```ts
import { GitHub } from 'authenticus/oauth'
```

### Presets

- [x] [Discord](https://discord.com/developers/applications)
- [x] [GitHub](https://github.com/settings/developers)
- [x] [Google](https://console.cloud.google.com/apis/dashboard)
- [x] [Spotify](https://developer.spotify.com/dashboard)

### Usage

> [!IMPORTANT]  
> You should wrap your code within a [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) block, as each of the methods listed below can cause an `AuthenticusError` in some rare cases.

1. **Initialize client.**

    ```ts
    const github = new GitHub({
      clientId: '...',
      clientSecret: '...',
      scopes: [
        'read:user',
        'user:email'
      ] // optional
    })
    ```

2. **Create a authorization url.**

   ```ts
   const url = github.createAuthorizeUri({
     state: '...',
     allowSignup: true
   })
   ```

3. **Retrieve an access token.**

   ```ts
   const { accessToken } = await github.getToken({
     code: '...',
     redirectUri: 'https://example.com/oauth2/callback'
   })
   ```

4. **Retrieve the user.**

   ```ts
   const user = await github.getUser(accessToken)

   , normalizedUser = github.normalizeUser(user)
   ```
