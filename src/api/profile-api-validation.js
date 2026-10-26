import { AID, API_HEADERS, READ_PINFO, createFetch, updateFetch } from '../constants.jsx'

const AID_PATTERN = /^[A-Za-z0-9_-]+={0,2}$/

/** Checks configuration only. It makes no request and has no UI dependency. */
export function validateProfileApiConfig({ aid = AID, apiKey = API_HEADERS['x-api-key'] } = {}) {
  const errors = []
  if (!aid || !AID_PATTERN.test(aid)) errors.push('AID is required and must be a URL-safe account identifier.')
  if (!apiKey || apiKey === 'replace-with-your-api-key') errors.push('An API key is required.')
  return { valid: errors.length === 0, errors }
}

/** Reads profile data and determines the only valid write operation. */
export async function selectProfileWriteOperation({ signal, fetchImpl = fetch } = {}) {
  const config = validateProfileApiConfig()
  if (!config.valid) return { valid: false, operation: null, errors: config.errors }

  const response = await fetchImpl(READ_PINFO, { signal, headers: API_HEADERS })
  if (!response.ok) return { valid: false, operation: null, errors: [`Profile read validation failed (${response.status}).`] }

  const profiles = await response.json()
  const exists = Array.isArray(profiles) && profiles.length > 0
  return { valid: true, operation: exists ? 'update' : 'create', profiles, execute: exists ? updateFetch : createFetch }
}

/** Validates configuration and profile state before writing. */
export async function validateAndSaveProfile(payload, options) {
  const selection = await selectProfileWriteOperation(options)
  if (!selection.valid) return selection
  if (!payload || payload.aid !== AID) {
    return { valid: false, operation: selection.operation, errors: ['Payload AID must match VITE_AID.'] }
  }
  const response = await selection.execute(payload)
  if (!response.ok) {
    return { valid: false, operation: selection.operation, errors: [`Profile ${selection.operation} failed (${response.status}).`] }
  }
  return { valid: true, operation: selection.operation, response }
}
