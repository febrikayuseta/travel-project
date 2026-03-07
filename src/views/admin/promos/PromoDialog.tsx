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
import type { Promo, CreatePromoPayload } from '@/types/project-types'

type PromoDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: Promo
  onSuccess: () => void
}

const initialData: CreatePromoPayload = {
  title: '',
  description: '',
  imageUrl: '',
  promo_code: '',
  promo_discount_price: 0,
  minimum_claim_price: 0,
  terms_condition: ''
}

const PromoDialog = ({ open, setOpen, data, onSuccess }: PromoDialogProps) => {
  const [formData, setFormData] = useState<CreatePromoPayload>(initialData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        promo_code: data.promo_code || '',
        promo_discount_price: data.promo_discount_price || 0,
        minimum_claim_price: data.minimum_claim_price || 0,
        terms_condition: data.terms_condition || ''
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
        ? `/api/proxy/update-promo/${data.id}` 
        : '/api/proxy/create-promo'
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json.message || `Promo ${data ? 'updated' : 'created'} successfully`)
        onSuccess()
        handleClose()
      } else {
        toast.error(json.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save promo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle className='pbs-12 pli-12 flex flex-col gap-1'>
        <Typography variant='h4' fontWeight='bold'>
          {data ? 'Edit Promotion' : 'Create New Promo'}
        </Typography>
        <Typography variant='caption' className='opacity-60'>
          {data ? 'Update discount details and requirements' : 'Launch a new marketing offer'}
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
                label='Promo Title'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Promo Code'
                placeholder='SUMMER50'
                value={formData.promo_code}
                onChange={e => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Description'
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Banner/Image URL'
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='number'
                label='Discount Amount (IDR)'
                value={formData.promo_discount_price}
                onChange={e => setFormData({ ...formData, promo_discount_price: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type='number'
                label='Min. Claim Price (IDR)'
                value={formData.minimum_claim_price}
                onChange={e => setFormData({ ...formData, minimum_claim_price: Number(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Terms & Conditions'
                value={formData.terms_condition}
                onChange={e => setFormData({ ...formData, terms_condition: e.target.value })}
                required
              />
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
            {data ? 'Save Changes' : 'Launch Promo'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PromoDialog
