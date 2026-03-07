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
    company: pipe(string(), minLength(1, 'This field is required')),
    position: pipe(string(), minLength(1, 'This field is required')),
    password: pipe(
      string(),
      minLength(1, 'This field is required'),
      minLength(8, 'Password must be at least 8 characters long')
    ),
    confirm_password: pipe(
      string(),
      minLength(1, 'This field is required'),
      minLength(8, 'Confirm Password must be at least 8 characters long')
    ),
    terms: boolean('You must accept the terms and conditions')
  })

const positions = [
  { value: 'Staff', label: 'Staff' },
  { value: 'Business Owner', label: 'Business Owner' },
  { value: 'C-Level', label: 'C-Level (CEO/CFO/COO, etc)' },
  { value: 'Senior Manager', label: 'Senior Manager (Head/VP, etc)' },
  { value: 'Other', label: 'Other' },
]

const Register = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const authBackground = 'https://images.unsplash.com/photo-1542314831-c6a4d14effea?auto=format&fit=crop&w=1920&q=80'
  const characterIllustration = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'

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
      company: '',
      position: '',
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
          company: data.company,
          position: data.position,
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

      {/* Right side: Register Form */}
      <div className='flex flex-col justify-center items-center w-full md:w-[480px] h-full bg-[#2f2b3d] p-8 md:p-12 relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] overflow-y-auto'>
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
                Join the Adventure! 🗺️
              </Typography>
              <Typography variant='body1' style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Create your account and start exploring the world.
              </Typography>
            </div>
          </div>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Controller
              name='fullname'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Full Name'
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
                  label='Work Email'
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
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            <Controller
              name='company'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Company Name'
                  error={!!errors.company}
                  helperText={errors.company?.message}
                />
              )}
            />
             <Controller
              name='position'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label='Position'
                  error={!!errors.position}
                  helperText={errors.position?.message}
                >
                  {positions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
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
                  type={isPasswordShown ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message || '(Minimal 8 karakter, 1 angka, 1 huruf besar)'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
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
                        <IconButton edge='end' onClick={handleClickShowConfirmPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <div className='flex items-center gap-3'>
              <Controller
                name='terms'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={
                      <>
                        <span>I agree with </span>
                        <Link className='text-primary' href='/terms-conditions' target="_blank" onClick={e => e.stopPropagation()}>
                          Terms & Conditions
                        </Link>
                      </>
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

            <LoadingButton
              fullWidth
              variant='contained'
              type='submit'
              loading={isLoading}
            >
              Create Account
            </LoadingButton>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Sudah memiliki akun?</Typography>
              <Typography component={Link} href='/login' color='primary'>
                Sign in
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register