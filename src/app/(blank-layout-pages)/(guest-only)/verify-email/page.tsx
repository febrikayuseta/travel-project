// Next Imports
import type { Metadata } from 'next'
import { Suspense } from 'react'

// Component Imports
import VerifyEmail from '@views/VerifyEmail'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address'
}

const VerifyEmailPage = () => {
  // Vars
  const mode = getServerMode()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail mode={mode} />
    </Suspense>
  )
}

export default VerifyEmailPage
