# Profile API validation (no UI)

## Configuration

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_KEY` to the API key supplied for the environment.
3. Set `VITE_AID` to the account AID. The example `YWNjb3VudF83NjYx` is a sample only.
4. Restart the Vite process after changing `.env`.

`.env` is ignored by Git. Do not put an API key in source code or share it in a browser-only production client; a server-side proxy is preferred for production secrets.

## API-selection process

| Step | API | Validation result | Next action |
| --- | --- | --- | --- |
| 1 | None | AID and API key are present | Continue only when valid |
| 2 | `GET /api/global/rqx/dev/primeinfo/read?aid={AID}` | A non-empty profile array | Use `POST /local/global/rqx/dev/primeinfo/update` |
| 2 | Same read API | Empty profile array | Use `POST /local/global/rqx/dev/primeinfo/create` |
| 2 | Same read API | HTTP/network error or unexpected data | Stop; do not call create or update |

## Use from another tool

Import the validation module; it has no React or UI dependency:

```js
import { validateAndSaveProfile } from './src/api/profile-api-validation.js'
const result = await validateAndSaveProfile(payload)
if (!result.valid) console.error(result.errors)
else console.log(`Ran the ${result.operation} API`)
```

`validateAndSaveProfile` checks configuration, reads the current profile, selects exactly one write API, verifies that `payload.aid` matches `VITE_AID`, and then executes the selected request. If validation or the read fails, it runs no write API.

For validation only (without a write), call `selectProfileWriteOperation()`. Its returned `operation` is `create` or `update`; its `execute` function is the corresponding API call.
