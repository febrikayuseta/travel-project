'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

// Third-party Imports
import { OTPInput } from 'input-otp'
import type { SlotProps } from 'input-otp'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Style Imports
import styles from '@/libs/styles/inputOtp.module.css'

const Slot = (props: SlotProps) => {
  return (
    <div className={classnames(styles.slot, { [styles.slotActive]: props.isActive })}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className='w-px h-5 bg-textPrimary' />
    </div>
  )
}

const VerifyEmail = ({ mode }: { mode: Mode }) => {
  // States
  const [otp, setOtp] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { settings } = useSettings()

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-2-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-2-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-two-steps-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-two-steps-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-two-steps-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-two-steps-light-border.png'

  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  useEffect(() => {
    if (!email) {
      toast.error('Email is missing')
      router.push('/login')
    }
  }, [email, router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/proxy/v1/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp_type: 'Verification Email',
          code: otp
        })
      })

      const responseData = await res.json()

      if (res.ok && responseData.success) {
        toast.success('Email verified successfully!')
        router.push('/login')
      } else {
        const errorMessage = responseData.error?.message || responseData.message || 'Verification failed';
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResending(true)
    try {
      const res = await fetch('/api/proxy/v1/auth/otp/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp_type: 'Verification Email'
        })
      })

      const responseData = await res.json()

      if (res.ok && responseData.success) {
        toast.success('Verification code resent successfully!')
      } else {
        const errorMessage = responseData.error?.message || responseData.message || 'Resend failed';
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[653px] max-is-full bs-auto'
          />
        </div>
        <img src={authBackground} className='absolute bottom-[4%] z-[-1] is-full max-md:hidden' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Verify your email ✉️</Typography>
            <Typography>
              We sent a verification code to your email. Enter the code from the email in the field below.
            </Typography>
            <Typography className='font-medium' color='text.primary'>
              {email}
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleVerify} className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
              <Typography>Type your 6 digit security code</Typography>
              <OTPInput
                onChange={setOtp}
                value={otp}
                maxLength={6}
                containerClassName='group flex items-center'
                render={({ slots }) => (
                  <div className='flex items-center justify-between w-full gap-4'>
                    {slots.slice(0, 6).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
              />
            </div>
            <LoadingButton fullWidth variant='contained' type='submit' loading={isLoading}>
              Verify My Account
            </LoadingButton>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Didn&#39;t get the code?</Typography>
              <Typography 
                color='primary' 
                component={Link} 
                href='/' 
                onClick={handleResend}
                className={isResending ? 'pointer-events-none opacity-50' : ''}
              >
                {isResending ? 'Resending...' : 'Resend'}
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
