'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, forward, boolean, check } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

type FormData = InferInput<typeof schema>

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

const schema = object({
  fullname: pipe(string(), minLength(1, 'This field is required')),
  email: pipe(string(), minLength(1, 'This field is required')),
  phone: pipe(string(), minLength(1, 'This field is required')),
  password: pipe(string(), minLength(1, 'This field is required')),
  confirm_password: pipe(string(), minLength(1, 'This field is required')),
  terms: boolean('You must accept the terms and conditions')
})



const inputStyles = {
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--mui-palette-primary-main)' },
    '& .MuiSelect-select': { color: 'white' },
    '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.5)' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--mui-palette-primary-main)' }
}

const Register = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const authBackground = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
  const characterIllustration = 'https://images.unsplash.com/photo-14364d1865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      terms: false
    }
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!data.terms) {
      toast.error('You must accept the Terms & Conditions to continue')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          password: data.password,
          confirm_password: data.confirm_password
        })
      })

      const responseData = await res.json()

      if (res.ok) {
        toast.success(responseData.data?.message || 'Registration successful. You can now login.')
        router.push('/login')
        router.refresh()
      } else {
        const errorMessage = responseData.message || 'Registration failed';
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex h-screen w-full overflow-hidden bg-[#0a0a0c] relative'>
      {/* Left side: Immersive Travel Scene */}
      <div
        className={classnames(
          'relative hidden md:flex flex-1 items-center justify-center p-16 overflow-hidden',
          {
            'border-e border-white/5': settings.skin === 'bordered'
          }
        )}
      >
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `linear-gradient(rgba(10, 10, 12, 0.4), rgba(10, 10, 12, 0.4)), url(${authBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className='z-10 relative text-center flex flex-col items-center gap-6 px-10'>
          <div className='relative'>
            <div className='absolute -inset-6 bg-primary/30 blur-[60px] rounded-full' />
            <i className='ri-compass-3-line text-white text-[100px] relative z-10 opacity-90' />
          </div>
          <div className='flex flex-col gap-2'>
            <Typography variant='h1' className='text-white font-black tracking-tighter leading-none' style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              EXPLORE THE <span className='text-primary'>UNSEEN</span>
            </Typography>
            <div className='h-1.5 w-32 bg-primary mx-auto my-2 rounded-full shadow-[0_0_20px_rgba(var(--mui-palette-primary-mainChannel),0.5)]' />
          </div>
          <Typography variant='h4' className='text-white/70 font-light italic max-w-[500px] leading-relaxed'>
            &quot;Adventure is worthwhile in itself. Join our community of world explorers and start your journey.&quot;
          </Typography>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className='flex flex-col justify-center items-center w-full md:w-[520px] h-full bg-[#1c1b29] p-8 md:p-12 relative z-20 shadow-2xl overflow-y-auto'>
        <div className='flex flex-col gap-8 w-full max-w-[420px] z-30 py-8'>
          <div className='flex flex-col gap-6'>
            <Link
              href='/'
              className='flex items-center gap-3 self-start py-3 px-7 rounded-full bg-primary/20 border border-primary/20 transition-all hover:bg-primary/30 shadow-lg shadow-primary/10'
            >
              <i className='ri-flight-takeoff-line text-primary text-3xl' />
              <Typography variant='h5' className='font-bold uppercase tracking-[3px] text-primary'>
                TravelYuk
              </Typography>
            </Link>
            <div>
              <Typography
                variant='h3'
                fontWeight='900'
                style={{ color: 'white', marginBottom: '12px', letterSpacing: '-0.5px' }}
              >
                Join the Adventure! 🗺️
              </Typography>
              <Typography variant='body1' style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6' }}>
                Create your account and unlock a world of exclusive experiences.
              </Typography>
            </div>
          </div>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
            <div className='flex flex-col gap-5'>
              <Typography variant='overline' style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold' }}>
                Personal Details
              </Typography>
              <Controller
                name='fullname'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Full Name'
                    sx={inputStyles}
                    error={!!errors.fullname}
                    helperText={errors.fullname?.message}
                  />
                )}
              />
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Email'
                    sx={inputStyles}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Phone Number'
                    sx={inputStyles}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />

            </div>

            <div className='flex flex-col gap-5'>
              <Typography variant='overline' style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold' }}>
                Account Security
              </Typography>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    type={isPasswordShown ? 'text' : 'password'}
                    sx={inputStyles}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} style={{ color: 'rgba(255,255,255,0.5)' }} />
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
                rules={{ required: true }}
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
                          >
                            <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </div>
            <div className='flex items-center gap-3'>
              <Controller
                name='terms'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={
                      <Typography style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        <span>I agree with </span>
                        <Link
                          className='text-primary'
                          href='/terms-conditions'
                          target='_blank'
                          onClick={e => e.stopPropagation()}
                        >
                          Terms & Conditions
                        </Link>
                      </Typography>
                    }
                  />
                )}
              />
            </div>
            {errors.terms && (
              <Typography color='error' variant='caption'>
                {errors.terms.message}
              </Typography>
            )}

            <div className='flex flex-col gap-6 mt-4'>
              <LoadingButton
                fullWidth
                size='large'
                variant='contained'
                type='submit'
                loading={isLoading}
                className='py-4 font-bold text-lg shadow-xl shadow-primary/20 rounded-2xl'
              >
                Create Account
              </LoadingButton>
              <div className='flex justify-center items-center flex-wrap gap-2 text-[15px]'>
                <Typography style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Already have an account?</Typography>
                <Typography
                  component={Link}
                  href='/login'
                  color='primary'
                  className='font-bold hover:underline underline-offset-4'
                >
                  Sign in
                </Typography>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register