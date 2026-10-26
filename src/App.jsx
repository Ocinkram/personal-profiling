import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Box, Button, CssBaseline, IconButton, Paper, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import { createProfileApiClient, validateProfileConfig } from './constants.jsx'

const theme = createTheme({ palette: { primary: { main: '#286dc7' }, text: { primary: '#142343' } }, typography: { fontFamily: 'Inter, Arial, sans-serif' } })

function App({ AID, API_KEY, ENV = 'dev', API_ORIGIN, onSaved, onError }) {
  const [profileInfo, setProfileInfo] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const inputRef = useRef(null)
  const configError = validateProfileConfig({ AID, API_KEY, ENV, API_ORIGIN })
  const client = useMemo(() => createProfileApiClient({ AID, API_KEY, ENV, API_ORIGIN }), [AID, API_KEY, ENV, API_ORIGIN])

  useEffect(() => {
    if (configError) return undefined
    const controller = new AbortController()

    async function readProfileInfo() {
      try {
        const response = await fetch(client.readProfileUrl, {
          signal: controller.signal,
          headers: client.headers,
        })

        if (!response.ok) {
          throw new Error(`Unable to read profile information (${response.status})`)
        }

        const profiles = await response.json()
        const profile = Array.isArray(profiles) ? profiles[0] : null

        setProfileInfo(profiles)
        setFirstName(profile?.first_name ?? '')
        setLastName(profile?.last_name ?? '')
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to read profile information:', error)
          setSubmitError(error.message)
          onError?.(error)
        }
      }
    }

    readProfileInfo()

    return () => controller.abort()
  }, [client, configError, onError])

  const hasProfile = Array.isArray(profileInfo) && profileInfo.length > 0

  function handlePhotoChange(event) {
    const [file] = event.target.files
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setSubmitError('Please select a JPG, PNG, or WebP image under 5 MB.')
      return
    }
    setSubmitError('')
    setPhotoUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (configError) {
      setSubmitError(configError)
      return
    }
    const payload = {
      aid: AID,
      contact_info: {},
      first_name: firstName,
      last_name: lastName,
      middle_name: ' ',
      other_info: { gender: '', civil_status: '', birthdate: '' },
      profile: { profile: '' },
      role: null,
      suffix: '',
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await (hasProfile ? client.update(payload) : client.create(payload))

      if (!response.ok) {
        throw new Error(`Unable to save profile (${response.status})`)
      }

      setProfileInfo([{ ...payload }])
      onSaved?.(payload)
    } catch (error) {
      setSubmitError(error.message)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box component="main" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, sm: 3 }, bgcolor: 'rgba(48, 67, 96, .62)' }}>
      <Paper component="section" elevation={0} aria-labelledby="profile-title" sx={{ width: 'min(100%, 650px)', p: { xs: '30px 24px 24px', sm: '38px 48px 32px' }, borderRadius: { xs: '22px', sm: '28px' }, boxShadow: '0 20px 40px rgba(15, 29, 54, .18)' }}>
        <Typography id="profile-title" component="h1" sx={{ color: '#122143', textAlign: 'center', fontSize: 24, lineHeight: '32px', fontWeight: 700, letterSpacing: '-.5px' }}>Complete your profile</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', my: { xs: 4, sm: '38px' } }}>
            <Avatar src={photoUrl} alt={photoUrl ? 'Selected profile' : ''} sx={{ width: 124, height: 124, color: '#91b2d9', bgcolor: '#f3f7fd', border: '2px dashed #b8d1f0', '& svg': { fontSize: 55 } }}><AccountCircleOutlinedIcon /></Avatar>
            <IconButton type="button" aria-label="Upload profile photo" onClick={() => inputRef.current?.click()} sx={{ position: 'absolute', top: 82, left: 'calc(50% + 23px)', width: 43, height: 43, color: '#fff', bgcolor: '#286dc7', border: '3px solid #fff', boxShadow: '0 2px 6px #a1b0c5', '&:hover': { bgcolor: '#1e5fae' }, '& svg': { fontSize: 19 } }}><CameraAltOutlinedIcon /></IconButton>
            <Box component="input" ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} />
            <Button type="button" onClick={() => inputRef.current?.click()} sx={{ minWidth: 0, mt: '14px', p: 0, color: '#28466c', fontSize: 14, fontWeight: 700, lineHeight: '20px', textTransform: 'none' }}>Upload profile photo</Button>
            <Typography sx={{ mt: '2px', color: '#9aacc4', fontSize: 14, lineHeight: '20px' }}>JPG, PNG or WebP &middot; Max 5 MB</Typography>
          </Box>
          <Box><Typography component="label" htmlFor="firstName" sx={{ display: 'block', mb: 1, color: '#284464', fontSize: 14, lineHeight: '20px', fontWeight: 700, '& span': { color: '#df5260' } }}>First name <Box component="span">*</Box></Typography><TextField id="firstName" name="firstName" placeholder="Enter your first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 56, borderRadius: '12px', color: '#284464', fontSize: 14, '& fieldset': { borderColor: '#d8e2ef' }, '&:hover fieldset': { borderColor: '#aabed7' }, '&.Mui-focused fieldset': { borderWidth: '1.5px', borderColor: '#286dc7' } }, '& input::placeholder': { color: '#acbcd0', opacity: 1 } }} /></Box>
          <Box sx={{ mt: '20px' }}><Typography component="label" htmlFor="lastName" sx={{ display: 'block', mb: 1, color: '#284464', fontSize: 14, lineHeight: '20px', fontWeight: 700, '& span': { color: '#df5260' } }}>Last name <Box component="span">*</Box></Typography><TextField id="lastName" name="lastName" placeholder="Enter your last name" value={lastName} onChange={(event) => setLastName(event.target.value)} required fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 56, borderRadius: '12px', color: '#284464', fontSize: 14, '& fieldset': { borderColor: '#d8e2ef' }, '&:hover fieldset': { borderColor: '#aabed7' }, '&.Mui-focused fieldset': { borderWidth: '1.5px', borderColor: '#286dc7' } }, '& input::placeholder': { color: '#acbcd0', opacity: 1 } }} /></Box>
          {(submitError || configError) && <Typography role="alert" sx={{ mt: 2, mb: '-16px', color: '#bd2633', fontSize: 14, lineHeight: '20px' }}>{submitError || configError}</Typography>}
          <Button type="submit" variant="contained" disabled={isSubmitting || Boolean(configError)} fullWidth sx={{ height: 56, mt: '32px', borderRadius: '12px', bgcolor: '#286dc7', boxShadow: '0 9px 16px rgba(40, 109, 199, .2)', fontSize: 14, lineHeight: '20px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#1e5fae' } }}>{isSubmitting ? 'Saving...' : 'Save & Continue →'}</Button>
        </Box>
      </Paper>
    </Box>
  </ThemeProvider>
}

export default App
export { App as ProfileForm }
