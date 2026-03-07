'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'
import IconButton from '@mui/material/IconButton'
import { toast } from 'react-toastify'

// Type Imports
import type { PaymentMethod } from '@/types/project-types'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'
import PaymentMethodDialog from './PaymentMethodDialog'

const PaymentMethodList = () => {
  // States
  const [data, setData] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchPaymentMethods = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/payment-methods')
      const json = await res.json()
      if (res.ok) {
        setData(parseApiData<PaymentMethod[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedMethod(undefined)
    setOpenDialog(true)
  }

  const handleDeleteClick = (id: string) => {
    setMethodToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!methodToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/proxy/delete-payment-method/${methodToDelete}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(json.message || 'Method deleted successfully')
        fetchPaymentMethods()
        setDeleteDialogOpen(false)
      } else {
        toast.error(json.message || 'Failed to delete method')
      }
    } catch (error) {
      toast.error('An error occurred during deletion')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <CircularProgress size={60} thickness={4} />
        <Typography className='mt-6 text-xl font-bold opacity-40'>Scanning Gateway Infrastructure...</Typography>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-end'>
        <Button 
          variant='contained' 
          startIcon={<i className='ri-add-line' />} 
          className='rounded-xl'
          onClick={handleAdd}
          size='large'
        >
          Add Gateway
        </Button>
      </div>

      <Grid container spacing={6}>
        {data.map(method => (
          <Grid item xs={12} sm={6} md={4} key={method.id}>
            <Card className='rounded-[32px] overflow-hidden shadow-xl border border-divider h-full flex flex-col group hover:border-primary/50 transition-all'>
              <CardContent className='p-8 flex-grow'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='bg-primary/5 p-4 rounded-2xl'>
                    {method.imageUrl ? (
                      <img src={method.imageUrl} alt={method.name} className='w-12 h-12 object-contain' />
                    ) : (
                      <i className='ri-bank-card-2-line text-4xl text-primary' />
                    )}
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <div className='w-4 h-4 rounded-full bg-success shadow-lg shadow-success/20' title='System Active' />
                    <div className='flex gap-1'>
                      <IconButton size='small' color='secondary' onClick={() => handleEdit(method)}>
                        <i className='ri-edit-box-line' />
                      </IconButton>
                      <IconButton size='small' color='error' onClick={() => handleDeleteClick(method.id)}>
                        <i className='ri-delete-bin-line' />
                      </IconButton>
                    </div>
                  </div>
                </div>
                
                <Typography variant='h5' fontWeight='900' className='mb-2 tracking-tight'>
                  {method.name}
                </Typography>
                <Typography variant='caption' className='block font-mono opacity-40 uppercase tracking-widest mb-6'>
                  ID: {method.id.split('-')[0]}
                </Typography>
                
                <Divider className='opacity-10 mb-6' />
                
                <div className='flex items-center gap-2 opacity-60'>
                  <i className='ri-verified-badge-line text-lg' />
                  <Typography variant='body2' fontWeight='bold'>Verified Provider</Typography>
                </div>
              </CardContent>
              
              <CardContent className='p-8 pt-0 mt-auto'>
                 <Button 
                  variant='outlined' 
                  fullWidth 
                  size='large' 
                  className='rounded-2xl font-black uppercase text-xs tracking-widest group-hover:bg-primary group-hover:text-white transition-all'
                  onClick={() => handleEdit(method)}
                 >
                   Manage Gateway
                 </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {data.length === 0 && (
          <Grid item xs={12}>
            <Card className='p-20 text-center border-dashed border-2 border-divider bg-transparent rounded-[40px]'>
              <Typography variant='h4' fontWeight='bold' className='opacity-20 italic'>
                No Payment Gateways Connected
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      <PaymentMethodDialog 
        open={openDialog}
        setOpen={setOpenDialog}
        data={selectedMethod}
        onSuccess={fetchPaymentMethods}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle className='pbs-12 pli-12 flex flex-col items-center gap-2'>
          <i className='ri-error-warning-line text-[80px] text-warning' />
          <Typography variant='h4' fontWeight='bold'>Delete Gateway?</Typography>
        </DialogTitle>
        <DialogContent className='pli-12 pbs-0 text-center'>
          <Typography>
            This will disconnect the payment provider. Customers won't be able to use it.
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbe-12 pli-12 gap-3'>
          <Button variant='outlined' color='secondary' onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <LoadingButton 
            variant='contained' 
            color='error' 
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            Yes, Disconnect
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PaymentMethodList
