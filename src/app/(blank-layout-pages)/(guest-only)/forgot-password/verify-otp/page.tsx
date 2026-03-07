// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ForgotPasswordVerifyOtp from '@views/ForgotPasswordVerifyOtp'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Verify OTP',
  description: 'Verify your OTP for password reset'
}

const ForgotPasswordVerifyOtpPage = () => {
  // Vars
  const mode = getServerMode()

  return <ForgotPasswordVerifyOtp mode={mode} />
}

export default ForgotPasswordVerifyOtpPage
