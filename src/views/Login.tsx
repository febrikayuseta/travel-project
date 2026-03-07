'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Third-party Imports
// NextAuth implementation replaced by standard API fetch
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe, nonEmpty } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'
import { toast } from 'react-toastify'

// Type Imports
import type { Mode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

type FormData = InferInput<typeof schema>

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address')),
  password: pipe(
    string(),
    nonEmpty('This field is required')
  )
})

const inputStyles = {
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--mui-palette-primary-main)' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--mui-palette-primary-main)' }
}

const Login = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const authBackground = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80'
  const characterIllustration = 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=800&q=80'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { settings } = useSettings()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const redirectURL = searchParams.get('redirectTo') ?? themeConfig.homePageUrl
      
      toast.success('Login successful!')
      router.push(redirectURL)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Check your email/password.')
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
            <i className='ri-map-2-line text-white text-[100px] relative z-10 opacity-90' />
          </div>
          <div className='flex flex-col gap-2'>
            <Typography variant='h1' className='text-white font-black tracking-tighter leading-none' style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              BEYOND the <span className='text-primary'>HORIZON</span>
            </Typography>
            <div className='h-1.5 w-32 bg-primary mx-auto my-2 rounded-full shadow-[0_0_20px_rgba(var(--mui-palette-primary-mainChannel),0.5)]' />
          </div>
          <Typography variant='h4' className='text-white/70 font-light italic max-w-[500px] leading-relaxed'>
            &quot;Life is either a daring adventure or nothing at all. Log in to continue your global exploration.&quot;
          </Typography>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className='flex flex-col justify-center items-center w-full md:w-[500px] h-full bg-[#1c1b29] p-8 md:p-12 relative z-20 shadow-2xl overflow-y-auto'>
        <div className='flex flex-col gap-10 w-full max-w-[400px] z-30 py-8'>
          <div className='flex flex-col gap-8'>
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
              <Typography variant='h3' fontWeight='900' style={{ color: 'white', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                Welcome Back! 👋🏻
              </Typography>
              <Typography variant='body1' style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6' }}>
                Please sign-in to your TravelYuk account to continue your journey.
              </Typography>
            </div>
          </div>

          <form
            noValidate
            action={() => {}}
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  type='email'
                  label='Email'
                  sx={inputStyles}
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  {...((errors.email) && {
                    error: true,
                    helperText: errors?.email?.message
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Password'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  sx={inputStyles}
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} style={{ color: 'rgba(255,255,255,0.5)' }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href='/forgot-password'
              >
                Forgot password?
              </Typography>
            </div>
            <div className='flex flex-col gap-6 mt-4'>
              <LoadingButton
                fullWidth
                size='large'
                variant='contained'
                type='submit'
                loading={isLoading}
                className='py-4 font-bold text-lg shadow-xl shadow-primary/20 rounded-2xl'
              >
                Log In
              </LoadingButton>
              <div className='flex justify-center items-center flex-wrap gap-2 text-[15px]'>
                <Typography style={{ color: 'rgba(255, 255, 255, 0.5)' }}>New on our platform?</Typography>
                <Typography component={Link} href='/register' color='primary' className='font-bold hover:underline underline-offset-4'>
                  Create an account
                </Typography>
              </div>
            </div>
          </form>
          {/* <Button
            color='secondary'
            className='self-center text-textPrimary'
            startIcon={<img src='/images/logos/google.png' alt='Google' width={22} />}
            sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}
            onClick={() => {}}
          >
            Sign in with Google
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default Login
