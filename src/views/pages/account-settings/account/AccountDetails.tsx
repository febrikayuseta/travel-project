'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { toast } from 'react-toastify'

// Type Imports
import type { User } from '@/types/project-types'

// Utils Imports
import { parseApiData } from '@/utils/apiUtils'
import ImageUploader from '@/components/ImageUploader'

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePictureUrl: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/proxy/user')
      const json = await res.json()
      if (res.ok) {
        const user = parseApiData<User>(json)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          profilePictureUrl: user.profilePictureUrl || '',
          phoneNumber: user.phoneNumber || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/proxy/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (res.ok) {
        toast.success('Profile updated successfully!')
        fetchUser()
      } else {
        toast.error(json.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred while updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className='p-12 flex justify-center items-center'>
        <CircularProgress />
      </Card>
    )
  }

  return (
    <Card className='shadow-xl rounded-3xl overflow-hidden border border-primary/5'>
      <CardHeader 
        title={<Typography variant='h4' fontWeight='bold'>My Account Settings</Typography>}
        subheader="Manage your personal travel profile details here."
        className='p-8 bg-actionHover'
      />
      <Divider />
      <CardContent className='p-8'>
        <form onSubmit={handleSave}>
          <Grid container spacing={6}>
            {/* Profile Picture Preview */}
            <Grid item xs={12} className='flex flex-col gap-6 mbe-4'>
              <div className='flex items-center gap-6'>
                <div className='relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg shrink-0'>
                  <img 
                    src={formData.profilePictureUrl || '/images/avatars/1.png'} 
                    alt='Profile' 
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/avatars/1.png'
                    }}
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <Typography variant='h6' fontWeight='bold'>Profile Picture</Typography>
                  <Typography variant='caption' color='text.secondary'>Upload a new avatar or enter a URL in the form below.</Typography>
                </div>
              </div>
              <ImageUploader 
                onUploadSuccess={(url) => setFormData({ ...formData, profilePictureUrl: url })}
              />
            </Grid>

            {/* Form Fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Full Name'
                placeholder='Enter your full name'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                variant='outlined'
                className='rounded-xl'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Email Address'
                placeholder='name@example.com'
                type='email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Profile Picture URL'
                placeholder='https://example.com/photo.jpg'
                value={formData.profilePictureUrl}
                onChange={e => setFormData({ ...formData, profilePictureUrl: e.target.value })}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Phone Number'
                placeholder='+62 812 3456 7890'
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                variant='outlined'
              />
            </Grid>

            {/* Actions */}
            <Grid item xs={12} className='pbt-4'>
              <Divider className='mbe-6' />
              <div className='flex items-center justify-between'>
                <Typography variant='caption' color='text.secondary' className='max-w-[300px]'>
                  Ensure your information is up to date to receive the latest travel updates.
                </Typography>
                <Button
                  variant='contained'
                  size='large'
                  type='submit'
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} color='inherit' /> : <i className='ri-save-line' />}
                  className='rounded-xl px-10 py-3 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]'
                >
                  {saving ? 'Saving...' : 'Update Profile'}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
