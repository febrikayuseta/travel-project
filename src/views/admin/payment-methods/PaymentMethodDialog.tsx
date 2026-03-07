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
import type { PaymentMethod } from '@/types/project-types'

type PaymentMethodDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: PaymentMethod
  onSuccess: () => void
}

const initialData = {
  name: '',
  imageUrl: ''
}

const PaymentMethodDialog = ({ open, setOpen, data, onSuccess }: PaymentMethodDialogProps) => {
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        imageUrl: data.imageUrl || ''
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
        ? `/api/proxy/update-payment-method/${data.id}` 
        : '/api/proxy/create-payment-method'
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json.message || `Payment method ${data ? 'updated' : 'created'} successfully`)
        onSuccess()
        handleClose()
      } else {
        toast.error(json.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save payment method')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle className='pbs-12 pli-12 flex flex-col gap-1'>
        <Typography variant='h4' fontWeight='bold'>
          {data ? 'Edit Gateway' : 'Add Payment Gateway'}
        </Typography>
        <Typography variant='caption' className='opacity-60'>
          {data ? 'Update connection parameters' : 'Integrate a new financial provider'}
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
                label='Method Name'
                placeholder='E.g. Bank Transfer, E-Wallet'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Icon URL'
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </Grid>
            {formData.imageUrl && (
              <Grid item xs={12}>
                <div className='flex items-center gap-4 bg-actionHover p-4 rounded-2xl border border-divider'>
                   <img src={formData.imageUrl} alt='Icon' className='w-12 h-12 object-contain' />
                   <Typography variant='body2' fontWeight='bold'>Icon Preview</Typography>
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
            {data ? 'Update Gateway' : 'Create Gateway'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default PaymentMethodDialog
