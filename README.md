# personal-profiling

Reusable React profile form for the RQX profile API.

## Install

```bash
npm install personal-profiling
```

## Use

```jsx
import { ProfileForm } from 'personal-profiling'

<ProfileForm
  AID={import.meta.env.VITE_AID}
  API_KEY={import.meta.env.VITE_API_KEY}
  ENV="dev"
  API_ORIGIN="https://your-api-origin.example.com"
/>
```

`AID`, `API_KEY`, `ENV`, and `API_ORIGIN` are supplied by the host. `ENV` defaults to `dev`; `onSaved` and `onError` callbacks are optional. Choose an available (ideally scoped) package name in `package.json` before `npm publish --access public`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
