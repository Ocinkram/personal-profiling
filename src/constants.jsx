/** Builds a profile API client from configuration supplied by the package host. */
export function createProfileApiClient({ AID, API_KEY, ENV = 'dev', API_ORIGIN, fetchImpl = fetch } = {}) {
  const origin = API_ORIGIN?.replace(/\/$/, '')
  const apiBase = origin && ENV ? `${origin}/api/global/rqx/${ENV}/primeinfo` : null
  const localBase = origin && ENV ? `${origin}/local/global/rqx/${ENV}` : null
  const headers = API_KEY ? { 'x-api-key': API_KEY } : {}
  const save = (url, payload) => fetchImpl(url, { method: 'POST', mode: 'cors', credentials: 'omit', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  return {
    aid: AID,
    headers,
    readAccountUrl: localBase && AID ? `${localBase}/account/read?aid=${encodeURIComponent(AID)}` : null,
    readProfileUrl: apiBase && AID ? `${apiBase}/read?aid=${encodeURIComponent(AID)}` : null,
    create: (payload) => save(`${localBase}/primeinfo/create`, payload),
    update: (payload) => save(`${localBase}/primeinfo/update`, payload),
  }
}

export function validateProfileConfig({ AID, API_KEY, ENV, API_ORIGIN } = {}) {
  const missing = [['AID', AID], ['API_KEY', API_KEY], ['ENV', ENV], ['API_ORIGIN', API_ORIGIN]].filter(([, value]) => !value).map(([name]) => name)
  return missing.length ? `Missing required profile configuration: ${missing.join(', ')}.` : null
}
