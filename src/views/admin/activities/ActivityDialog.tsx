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
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import type { Activity, Category } from '@/types/project-types'
import { parseApiData } from '@/utils/apiUtils'
import ImageUploader from '@/components/ImageUploader'

type ActivityDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: Activity
  onSuccess: () => void
}

const initialData = {
  title: '',
  categoryId: '',
  description: '',
  imageUrls: [] as string[],
  price: 0,
  price_discount: 0,
  rating: 0,
  total_reviews: 0,
  facilities: '',
  address: '',
  province: '',
  city: '',
  location_maps: ''
}

const ActivityDialog = ({ open, setOpen, data, onSuccess }: ActivityDialogProps) => {
  const [formData, setFormData] = useState(initialData)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/proxy/categories')
        const json = await res.json()
        if (res.ok) {
          const fetched = parseApiData<Category[]>(json)
          
          // Filter out empty names and sort alphabetically
          const processed = fetched
            .filter(cat => cat.name && cat.name.trim().length > 0)
            .sort((a, b) => a.name.localeCompare(b.name))

          setCategories(processed)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        categoryId: data.categoryId || '',
        description: data.description || '',
        imageUrls: (data.imageUrls || []).filter(url => url && url.trim().length > 0),
        price: data.price || 0,
        price_discount: data.price_discount || 0,
        rating: data.rating || 0,
        total_reviews: data.total_reviews || 0,
        facilities: data.facilities || '',
        address: data.address || '',
        province: data.province || '',
        city: data.city || '',
        location_maps: data.location_maps || ''
      })
    } else {
      setFormData(initialData)
    }
  }, [data, open])

  const handleClose = () => {
    setOpen(false)
    setFormData(initialData)
    setImageUrlInput('')
  }

  const addImageUrl = () => {
    if (imageUrlInput && !formData.imageUrls.includes(imageUrlInput)) {
      setFormData({ ...formData, imageUrls: [...formData.imageUrls, imageUrlInput] })
      setImageUrlInput('')
    }
  }

  const removeImageUrl = (index: number) => {
    const newUrls = [...formData.imageUrls]
    newUrls.splice(index, 1)
    setFormData({ ...formData, imageUrls: newUrls })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.price_discount > formData.price) {
      toast.error('Discounted price cannot be greater than regular price')
      return
    }

    setLoading(true)

    try {
      const url = data 
        ? `/api/proxy/update-activity/${data.id}` 
        : '/api/proxy/create-activity'
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json.message || `Activity ${data ? 'updated' : 'created'} successfully`)
        onSuccess()
        handleClose()
      } else {
        toast.error(json.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save activity')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
      <DialogTitle className='pbs-12 pli-12 flex flex-col gap-1'>
        <Typography variant='h4' fontWeight='bold'>
          {data ? 'Edit Activity' : 'Create New Activity'}
        </Typography>
        <Typography variant='caption' className='opacity-60'>
          {data ? 'Modify details for this travel experience' : 'Add a new adventure to the catalog'}
        </Typography>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className='pli-12 pbs-4 pbe-12'>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label='Activity Title'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label='Category'
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Description'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='number'
                label='Price (IDR)'
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='number'
                label='Discounted Price (IDR)'
                value={formData.price_discount}
                onChange={e => setFormData({ ...formData, price_discount: Number(e.target.value) })}
                error={formData.price_discount > formData.price}
                helperText={formData.price_discount > formData.price ? 'Cannot be greater than regular price' : ''}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Province'
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='City'
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Maps Link or Embed Code'
                placeholder='Paste Google Maps share link or iframe embed code here'
                value={formData.location_maps}
                onChange={e => setFormData({ ...formData, location_maps: e.target.value })}
                helperText='You can paste just the URL from Google Maps, or the full <iframe> embed tag. The system will handle both.'
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Address'
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Facilities'
                placeholder='Wifi, AC, Breakfast, etc.'
                value={formData.facilities}
                onChange={e => setFormData({ ...formData, facilities: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <div className='flex gap-2 mb-2'>
                <TextField
                  fullWidth
                  label='Add Image URL'
                  value={imageUrlInput}
                  onChange={e => setImageUrlInput(e.target.value)}
                />
                <Button variant='outlined' onClick={addImageUrl}>Add</Button>
              </div>
              <div className='mb-4'>
                <ImageUploader 
                  onUploadSuccess={(url) => {
                    if (!formData.imageUrls.includes(url)) {
                      setFormData({ ...formData, imageUrls: [...formData.imageUrls, url] })
                    }
                  }} 
                />
              </div>
              <div className='flex gap-4 flex-wrap'>
                {formData.imageUrls.filter(url => url && url.trim().length > 0).map((url, idx) => (
                  <div key={idx} className='relative w-24 h-24 rounded-lg overflow-hidden border border-divider'>
                    <img src={url} alt='Activity' className='w-full h-full object-cover' />
                    <IconButton 
                      size='small' 
                      className='absolute top-0 right-0 bg-black/40 text-white hover:bg-black/60'
                      onClick={() => removeImageUrl(idx)}
                    >
                      <i className='ri-close-line' />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Grid>
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
            className='min-w-[150px]'
          >
            {data ? 'Save Changes' : 'Create Activity'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ActivityDialog
