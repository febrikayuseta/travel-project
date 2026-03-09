// Next Imports
import type { Metadata } from 'next'
import { Suspense } from 'react'

// Component Imports
import Login from '@views/Login'
import FallbackSpinner from '@components/FallbackSpinner'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'TravelYuk - Login',
  description: 'Log in to your TravelYuk account.'
}

const LoginPage = () => {
  // Vars
  const mode = getServerMode()

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <Login mode={mode} />
    </Suspense>
  )
}

export default LoginPage
