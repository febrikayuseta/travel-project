'use client'

import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import { toast } from 'react-toastify'
import type { Banner, CreateBannerPayload } from '@/types/project-types'

type BannerDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: Banner
  onSuccess: () => void
}

const initialData: CreateBannerPayload = {
  name: '',
  imageUrl: ''
}

const BannerDialog = ({ open, setOpen, data, onSuccess }: BannerDialogProps) => {
  const [formData, setFormData] = useState<CreateBannerPayload>(initialData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        imageUrl: data.imageUrl
      })
    } else {
      setFormData(initialData)
    }
  }, [data, open])

  const handleClose = () => {
    setOpen(false)
    setFormData(initialData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = data 
        ? `/api/proxy/update-banner/${data.id}` 
        : '/api/proxy/create-banner'
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json.message || `Banner ${data ? 'updated' : 'created'} successfully`)
        onSuccess()
        handleClose()
      } else {
        toast.error(json.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save banner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle className='pbs-12 pli-12 flex flex-col gap-1'>
        <Typography variant='h4' fontWeight='bold'>
          {data ? 'Edit Banner' : 'Add New Banner'}
        </Typography>
        <Typography variant='caption' className='opacity-60'>
          {data ? 'Modify existing banner details' : 'Create a new promotional banner'}
        </Typography>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className='pli-12 pbs-4 pbe-12'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Banner Name'
                placeholder='Summer Sale 2024'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Image URL'
                placeholder='https://example.com/banner.jpg'
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </Grid>
            {formData.imageUrl && (
              <Grid item xs={12}>
                <Typography variant='caption' className='block mb-2 font-bold uppercase tracking-widest opacity-40'>
                  Preview
                </Typography>
                <div className='w-full h-40 rounded-2xl overflow-hidden border border-divider shadow-inner bg-actionHover flex items-center justify-center'>
                  <img 
                    src={formData.imageUrl} 
                    alt='Preview' 
                    className='w-full h-full object-cover'
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                  />
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions className='justify-center pbe-12 pli-12'>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton 
            variant='contained' 
            type='submit' 
            loading={loading}
            className='min-w-[120px]'
          >
            {data ? 'Save Changes' : 'Create Banner'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BannerDialog
