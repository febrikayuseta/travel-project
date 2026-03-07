// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Register from '@views/Register'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'TravelYuk - Register',
  description: 'Create your TravelYuk account and start your journey.'
}

const RegisterPage = () => {
  // Vars
  const mode = getServerMode()

  return <Register mode={mode} />
}

export default RegisterPage
