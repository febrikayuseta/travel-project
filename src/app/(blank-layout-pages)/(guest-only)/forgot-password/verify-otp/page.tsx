// Next Imports
import type { Metadata } from 'next'
import { Suspense } from 'react'

// Component Imports
import ForgotPasswordVerifyOtp from '@views/ForgotPasswordVerifyOtp'
import FallbackSpinner from '@components/FallbackSpinner'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify your OTP for password reset'
}

const ForgotPasswordVerifyOtpPage = () => {
  // Vars
  const mode = getServerMode()

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ForgotPasswordVerifyOtp mode={mode} />
    </Suspense>
  )
}

export default ForgotPasswordVerifyOtpPage
