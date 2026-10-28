# ProfileForm rules

## Visibility

- `isOpen` defaults to `true` and controls whether the modal is shown.
- `isRequired` forces the modal open after a successful profile read when either `first_name` or `last_name` is blank.
- While `/primeinfo/read` is loading, fails, or returns no profile record, the component renders nothing.

## Closing

- The close icon is shown only when the form is not locked.
- The form is locked when `isRequired` is `true` and either first name or last name is blank.
- A locked form cannot be closed with the close icon.
- When it is not locked, clicking the close icon hides the modal immediately and calls `onClose`.
- A successful save always hides the modal, calls `onSaved(payload)`, then calls `onClose`.

## Input and photo rules

- First name and last name are required fields.
- Profile photos must be JPG, PNG, or WebP and no larger than 5 MB.
- An invalid photo or a failed save is shown as an inline form error.

## Props

```jsx
<ProfileForm
  aid="account-id"
  apiKey="api-key"
  env="dev"
  apiOrigin="https://api.example.com"
  isOpen={true}
  isRequired={false}
  onClose={() => {}}
  onSaved={(profile) => {}}
  onError={(error) => {}}
/>
```
