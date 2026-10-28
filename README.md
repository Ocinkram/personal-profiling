# personal-profiling

Reusable React profile form for the RQX profile API.

## Install

```bash
npm install personal-profiling
```

## Use

```jsx
import { ProfileForm } from 'personal-profiling'
import 'personal-profiling/style.css'

<ProfileForm
  aid={import.meta.env.VITE_AID}
  apiKey={import.meta.env.VITE_API_KEY}
  env="dev"
  apiOrigin="https://your-api-origin.example.com"
  isOpen={true}
  isRequired={false}
  onClose={() => {}}
  onSaved={(profile) => {}}
  onError={(error) => {}}
/>
```

`aid`, `apiKey`, `env`, and `apiOrigin` are supplied by the host. `env` defaults to `dev`.

## Local development

1. Copy `.env.example` to `.env` and set `VITE_API_ORIGIN`, `VITE_API_KEY`, and `VITE_AID`.
2. Run `npm run dev`.
