'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import DirectionalIcon from '@components/DirectionalIcon'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

type FormData = {
  password: ''
  confirm_password: ''
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

const ResetPassword = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-4-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-4-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-reset-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-reset-password-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-reset-password-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-reset-password-light-border.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  useEffect(() => {
    const token = localStorage.getItem('reset_token')
    if (token) {
      setResetToken(token)
    } else {
      toast.error('Reset token not found. Please restart the process.')
      router.push('/forgot-password')
    }
  }, [router])

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: ''
    },
    mode: 'onChange'
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!resetToken) {
      toast.error('Token reset tidak valid. Silakan ulangi proses reset password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/proxy/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resetToken}`
        },
        body: JSON.stringify({
          password: data.password,
          confirm_password: data.confirm_password
        })
      })

      const responseData = await res.json()

      if (res.ok && responseData.success) {
        toast.success(responseData.data?.message || 'Password reset successful! Redirecting to login...')
        localStorage.removeItem('reset_token')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        if (res.status === 401) {
           toast.error('Sesi reset password habis. Silakan ulangi proses.')
           router.push('/forgot-password')
        } else {
           const errorMessage = responseData.error?.message || responseData.message || 'Failed to reset password';
           toast.error(errorMessage)
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex items-center justify-center bs-full flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[677px] max-is-full bs-auto'
          />
        </div>
        <img src={authBackground} className='absolute bottom-[4%] z-[-1] is-full max-md:hidden' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div>
            <Typography variant='h4'>Reset Password 🔒</Typography>
            <Typography className='mbs-1'>
              Your new password must be different from previously used passwords
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Controller
              name='password'
              control={control}
              rules={{ 
                required: 'This field is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                pattern: {
                  value: passwordRegex,
                  message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  label='Password'
                  type={isPasswordShown ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Controller
              name='confirm_password'
              control={control}
              rules={{ 
                required: 'This field is required',
                minLength: { value: 8, message: 'Confirm Password must be at least 8 characters long' },
                validate: (value) => value === watch('password') || 'Passwords do not match'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Confirm Password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle confirm password visibility'
                        >
                          <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <LoadingButton fullWidth variant='contained' type='submit' loading={isLoading}>
              Set New Password
            </LoadingButton>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href='/login' className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='ri-arrow-left-s-line'
                  rtlIconClass='ri-arrow-right-s-line'
                  className='text-xl'
                />
                <span>Back to Login</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword