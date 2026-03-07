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
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

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

      const redirectURL = searchParams.get('redirectTo') ?? '/'
      
      toast.success('Login successful!')
      router.push(redirectURL)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Check your email/password.')
      setIsLoading(false)
    }
  }

  return (
    <div className='flex h-[100dvh] w-full overflow-hidden bg-[#121212] relative'>
      {/* Left side: Illustration (Hidden on mobile) */}
      <div
        className={classnames(
          'relative hidden md:flex flex-1 h-full items-center justify-center p-12 overflow-hidden',
          {
            'border-e border-white/5': settings.skin === 'bordered'
          }
        )}
      >
        <div
          className='absolute inset-0 z-0'
          style={{
            backgroundImage: `url(${authBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.7
          }}
        />
        <img
          src={characterIllustration}
          alt='character-illustration'
          className='z-10 max-w-[550px] w-full rounded-2xl shadow-2xl object-cover aspect-[4/3] border-[6px] border-white/10'
        />
      </div>

      {/* Right side: Login Form */}
      <div className='flex flex-col justify-center items-center w-full md:w-[480px] h-full bg-[#2f2b3d] p-8 md:p-12 relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]'>
        <div className='flex flex-col gap-8 w-full max-w-[400px] z-30'>
          <div className='flex flex-col gap-6'>
            <Link
              href='/'
              className='flex items-center gap-3 self-start py-2.5 px-6 rounded-full bg-primary/15 transition-all hover:bg-primary/25'
            >
              <i className='ri-flight-takeoff-line text-primary text-3xl' />
              <Typography variant='h5' className='font-bold uppercase tracking-[2px] text-primary'>
                TravelYuk
              </Typography>
            </Link>
            <div>
              <Typography variant='h4' fontWeight='bold' style={{ color: 'white', marginBottom: '8px' }}>
                Welcome Back! 👋🏻
              </Typography>
              <Typography variant='body1' style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Please sign-in to your TravelYuk account
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
                          <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
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
            <LoadingButton
              fullWidth
              variant='contained'
              type='submit'
              loading={isLoading}
            >
              Log In
            </LoadingButton>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href='/register' color='primary'>
                Create an account
              </Typography>
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
