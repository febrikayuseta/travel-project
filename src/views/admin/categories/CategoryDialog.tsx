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
import type { Category, CreateCategoryPayload } from '@/types/project-types'
import ImageUploader from '@/components/ImageUploader'

type CategoryDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: Category
  onSuccess: () => void
}

const initialData: CreateCategoryPayload = {
  name: '',
  imageUrl: ''
}

const CategoryDialog = ({ open, setOpen, data, onSuccess }: CategoryDialogProps) => {
  const [formData, setFormData] = useState<CreateCategoryPayload>(initialData)
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
        ? `/api/proxy/update-category/${data.id}` 
        : '/api/proxy/create-category'
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json.message || `Category ${data ? 'updated' : 'created'} successfully`)
        onSuccess()
        handleClose()
      } else {
        toast.error(json.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle className='pbs-12 pli-12 flex flex-col gap-1'>
        <Typography variant='h4' fontWeight='bold'>
          {data ? 'Edit Category' : 'New Category'}
        </Typography>
        <Typography variant='caption' className='opacity-60'>
          {data ? 'Modify category properties' : 'Register a new classification for activities'}
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
                label='Category Name'
                placeholder='E.g. Adventure, Relax, Food'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Icon/Image URL'
                placeholder='https://example.com/icon.png'
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                helperText='Enter an image URL or upload one below'
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUploader 
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })} 
              />
            </Grid>
            {formData.imageUrl && (
              <Grid item xs={12}>
                <Typography variant='caption' className='block mb-2 font-bold opacity-40 uppercase'>Preview</Typography>
                <div className='w-24 h-24 rounded-2xl overflow-hidden border border-divider shadow-sm bg-actionHover p-2'>
                  <img 
                    src={formData.imageUrl} 
                    alt='Preview' 
                    className='w-full h-full object-contain'
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')}
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
          >
            {data ? 'Update Category' : 'Create Category'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CategoryDialog
