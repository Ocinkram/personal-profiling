// Change these values once to use a different account or API key everywhere.
// export const AID = 'YWNjb3VudF83MzI5'
export const AID = 'YWNjb3VudF83NjYx'

export const API_KEY = 'tJ1ROscurb83mqyY4B0To5WTb4ekFzMa8LgGKoZh'

const ENV = 'dev' //sb, prod

const API_ORIGIN = 'https://tpdjwm06fj.execute-api.ap-southeast-1.amazonaws.com'

export const API_HEADERS = {
  'x-api-key': API_KEY,
}
  
export const READ_AINFO = `${API_ORIGIN}/local/global/rqx/dev/account/read?aid=${AID}`
export const READ_PINFO = `${API_ORIGIN}/api/global/rqx/dev/primeinfo/read?aid=${AID}`
export const CREATE_API = `${API_ORIGIN}/local/global/rqx/dev/primeinfo/create`
export const UPDATE_API = `${API_ORIGIN}/local/global/rqx/dev/primeinfo/update`

function saveProfile(url, payload) {

  console.log(payload)

  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      ...API_HEADERS,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export const createFetch = (payload) => saveProfile(CREATE_API, payload)
export const updateFetch = (payload) => saveProfile(UPDATE_API, payload)