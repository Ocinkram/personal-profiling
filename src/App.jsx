import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import './icons.css'
import './close.css'
import { createProfileApiClient, validateProfileConfig } from './constants.jsx'

function App({ aid, apiKey, env = 'dev', apiOrigin, onSaved, onError, onClose, isOpen = true, isRequired = false }) {
  const [profileInfo, setProfileInfo] = useState(null)
  const [isReadComplete, setIsReadComplete] = useState(false)
  const [hasReadResult, setHasReadResult] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const inputRef = useRef(null)
  const configError = validateProfileConfig({ AID: aid, API_KEY: apiKey, ENV: env, API_ORIGIN: apiOrigin })
  const client = useMemo(() => createProfileApiClient({ AID: aid, API_KEY: apiKey, ENV: env, API_ORIGIN: apiOrigin }), [aid, apiKey, env, apiOrigin])
  useEffect(() => {
    if (isOpen) setIsDismissed(false)
  }, [isOpen])
  useEffect(() => {
    if (configError) return undefined
    const controller = new AbortController()
    setIsReadComplete(false); setHasReadResult(false)
    async function readProfileInfo() {
      try {
        const accountResponse = await fetch(client.readAccountUrl, { signal: controller.signal, headers: client.headers })
        if (!accountResponse.ok) throw new Error('Account read failed')
        const account = await accountResponse.json()
        const accountExists = Array.isArray(account) ? account.length > 0 : Boolean(account)
        if (!accountExists) return

        const response = await fetch(client.readProfileUrl, { signal: controller.signal, headers: client.headers })
        if (!response.ok) throw new Error('Profile read failed')
        const profiles = await response.json()
        if (!Array.isArray(profiles)) return
        const profile = profiles[0] ?? null
        setProfileInfo(profiles); setHasReadResult(true)
        if (profile) {
          setFirstName(profile.first_name ?? ''); setLastName(profile.last_name ?? '')
        }
      } catch {} finally { if (!controller.signal.aborted) setIsReadComplete(true) }
    }
    readProfileInfo()
    return () => controller.abort()
  }, [client, configError])
  const hasProfile = Array.isArray(profileInfo) && profileInfo.length > 0
  const isCloseLocked = isRequired && (!firstName.trim() || !lastName.trim())
  const showModal = !isDismissed && (isOpen || (isRequired && profileInfo !== null && isCloseLocked))
  if (!configError && (!isReadComplete || !hasReadResult)) return null
  function handleClose() {
    if (!isCloseLocked) {
      setIsDismissed(true)
      onClose?.()
    }
  }
  function handlePhotoChange(event) {
    const [file] = event.target.files
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setSubmitError('Please select a JPG, PNG, or WebP image under 5 MB.'); return }
    setSubmitError(''); setPhotoUrl(URL.createObjectURL(file))
  }
  async function handleSubmit(event) {
    event.preventDefault()
    if (configError) { setSubmitError(configError); return }
    const payload = { aid, contact_info: {}, first_name: firstName, last_name: lastName, middle_name: ' ', other_info: { gender: '', civil_status: '', birthdate: '' }, profile: { profile: '' }, role: null, suffix: '' }
    setIsSubmitting(true); setSubmitError('')
    try { const response = await (hasProfile ? client.update(payload) : client.create(payload)); if (!response.ok) throw new Error(`Unable to save profile (${response.status})`); setProfileInfo([{ ...payload }]); setIsDismissed(true); onSaved?.(payload); onClose?.() } catch (error) { setSubmitError(error.message); onError?.(error) } finally { setIsSubmitting(false) }
  }
  return <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" hidden={!showModal}><main className="profile-modal__content"><section className="profile-form">{!isCloseLocked && <button className="profile-form__close" type="button" aria-label="Close profile form" onClick={handleClose}>×</button>}<h1 id="profile-title">Complete your profile</h1><form onSubmit={handleSubmit} noValidate>{/* <div className="profile-photo"><div className="profile-photo__avatar">{photoUrl ? <img src={photoUrl} alt="Selected profile" /> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.01-8 4.5V20h16v-1.5c0-2.49-3.58-4.5-8-4.5Z" /></svg>}</div><button className="profile-photo__camera" type="button" aria-label="Upload profile photo" onClick={() => inputRef.current?.click()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3 7.17 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9Zm3 13a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg></button><input ref={inputRef} className="profile-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} /><button className="profile-photo__upload" type="button" onClick={() => inputRef.current?.click()}>Upload profile photo</button><p>JPG, PNG or WebP · Max 5 MB</p></div> */}<label className="profile-field">First name <span>*</span><input name="firstName" placeholder="Enter your first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required /></label><label className="profile-field">Last name <span>*</span><input name="lastName" placeholder="Enter your last name" value={lastName} onChange={(event) => setLastName(event.target.value)} required /></label>{(submitError || configError) && <p className="profile-form__error" role="alert">{submitError || configError}</p>}<button className="profile-form__submit" type="submit" disabled={isSubmitting || Boolean(configError)}>{isSubmitting ? 'Saving...' : 'Save & Continue →'}</button></form></section></main></div>
}
export default App
export { App as ProfileForm }
