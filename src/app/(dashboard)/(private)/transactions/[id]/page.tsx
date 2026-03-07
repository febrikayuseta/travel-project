'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// Third-party Imports
import { toast } from 'react-toastify'

// Type Imports
import type { Transaction } from '@/types/project-types'

// Utils Imports
import { formatRupiah, parseApiData } from '@/utils/apiUtils'

const TransactionDetailsPage = () => {
  // Params
  const { id } = useParams()
  const router = useRouter()

  // States
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [updatingProof, setUpdatingProof] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [proofUrl, setProofUrl] = useState('')

  const fetchTransaction = async () => {
    if (!id) return
    try {
      const res = await fetch(`/api/proxy/transaction/${id}`)
      const json = await res.json()
      if (res.ok) {
        const data = parseApiData<Transaction>(json)
        setTransaction(data)
        setProofUrl(data.proofPaymentUrl || '')
      } else {
        toast.error('Transaction not found')
        router.push('/transactions')
      }
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
      toast.error('Failed to fetch transaction details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransaction()
  }, [id])

  const handleCancel = async () => {
    if (!id) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/proxy/cancel-transaction/${id}`, { method: 'POST' })
      const json = await res.json()
      if (res.ok) {
        toast.success(json.message || 'Transaction cancelled')
        fetchTransaction()
      } else {
        toast.error(json.message || 'Failed to cancel transaction')
      }
    } catch (error) {
      toast.error('An error occurred during cancellation')
    } finally {
      setCancelling(false)
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/proxy/upload-image', {
        method: 'POST',
        body: formData
      })
      const json = await res.json()
      
      if (res.ok) {
        const url = json.url || json.data?.url || (json.data && json.data.imageUrl)
        if (url) {
          setProofUrl(url)
          toast.success('Image uploaded successfully!')
        } else {
          toast.error('Upload successful but no URL returned from server')
        }
      } else {
        toast.error(json.message || 'Image upload failed')
      }
    } catch (error) {
      toast.error('An error occurred during file upload')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateProof = async () => {
    if (!id || !proofUrl) return
    setUpdatingProof(true)
    try {
      const res = await fetch(`/api/proxy/update-transaction-proof-payment/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofPaymentUrl: proofUrl })
      })
      const json = await res.json()
      if (res.ok) {
        toast.success('Payment proof updated!')
        fetchTransaction()
      } else {
        toast.error(json.message || 'Failed to update payment proof')
      }
    } catch (error) {
      toast.error('An error occurred while updating the proof')
    } finally {
      setUpdatingProof(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'success'
      case 'pending': return 'warning'
      case 'failed':
      case 'cancelled': return 'error'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <Skeleton variant='rectangular' height={100} />
        <Skeleton variant='rectangular' height={300} />
      </div>
    )
  }

  if (!transaction) return <Box p={6}><Alert severity='error'>Transaction not found</Alert></Box>

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex justify-between items-center flex-wrap gap-4'>
        <div>
          <Typography variant='h3' fontWeight='bold' className='mb-1'>
            Booking Detail {transaction.invoiceId || `#${id.slice(0, 8)}`}
          </Typography>
          <Typography color='text.secondary'>
            Created on {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A'}
          </Typography>
        </div>
        <Button
          variant='outlined' 
          startIcon={<i className='ri-arrow-left-line' />}
          component={Link}
          href='/transactions'
        >
          Back to List
        </Button>
      </div>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={8}>
          <div className='flex flex-col gap-6'>
            <Card>
              <CardHeader title='Activities Summary' className='bg-actionHover p-4' />
              <CardContent className='p-0'>
                {transaction.carts?.map((cart, idx) => {
                  const activity = cart.activity
                  const price = activity?.price_discount || activity?.price || 0
                  return (
                    <Box key={cart.id} p={4} display='flex' gap={4} alignItems='center' borderBottom={idx < (transaction.carts?.length || 0) - 1 ? 1 : 0} borderColor='divider'>
                      {activity?.imageUrls?.[0] ? (
                        <img src={activity.imageUrls[0]} alt={activity.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <Box bgcolor='actionHover' width={80} height={80} borderRadius={2} display='flex' alignItems='center' justifyContent='center' color='textDisabled'>
                          No Image
                        </Box>
                      )}
                      <Box flexGrow={1}>
                        <Typography variant='h6' fontWeight='bold'>{activity?.title || 'Unknown Activity'}</Typography>
                        <Typography variant='body2' color='text.secondary'>{cart.quantity} x {formatRupiah(price)}</Typography>
                      </Box>
                      <Typography variant='h6' fontWeight='bold' color='primary'>
                        {formatRupiah(price * cart.quantity)}
                      </Typography>
                    </Box>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader title='Payment Confirmation' className='bg-actionHover p-4' />
              <CardContent className='p-6 flex flex-col gap-6'>
                {transaction.status === 'pending' ? (
                  <>
                    <Alert severity='info' icon={<i className='ri-information-line' />}>
                      Please upload your payment receipt to complete your booking.
                    </Alert>
                    
                    <Box display='flex' flexDirection='column' gap={4}>
                      <Box border='1px dashed' borderColor='divider' borderRadius={2} p={6} textAlign='center'>
                        <input
                          type='file'
                          id='payment-file'
                          style={{ display: 'none' }}
                          accept='image/*'
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUpload(file)
                          }}
                        />
                        <label htmlFor='payment-file'>
                          <LoadingButton
                            component='span'
                            loading={uploading}
                            variant='outlined'
                            startIcon={<i className='ri-upload-2-line' />}
                            className='mb-2'
                          >
                            Upload Receipt
                          </LoadingButton>
                        </label>
                        <Typography variant='caption' display='block' color='text.secondary'>
                          PNG, JPG or JPEG up to 5MB
                        </Typography>
                      </Box>

                      <TextField
                        fullWidth
                        label='Proof of Payment URL'
                        placeholder='https://...'
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        variant='outlined'
                      />

                      <LoadingButton
                        fullWidth
                        variant='contained'
                        onClick={handleUpdateProof}
                        loading={updatingProof} 
                        disabled={!proofUrl}
                        size='large'
                      >
                        Submit Payment Proof
                      </LoadingButton>
                    </Box>
                  </>
                ) : (
                  <Box display='flex' flexDirection='column' gap={4} alignItems='center' textAlign='center' py={6}>
                    <i className={transaction.status === 'success' ? 'ri-checkbox-circle-line text-success text-[80px]' : 'ri-close-circle-line text-error text-[80px]'} />
                    <div>
                      <Typography variant='h5' fontWeight='bold' gutterBottom>
                        Transaction {transaction.status === 'success' ? 'Verified!' : 'Cancelled'}
                      </Typography>
                      <Typography color='text.secondary'>
                        {transaction.status === 'success' 
                          ? 'Your booking is confirmed! Pack your bags for the adventure.'
                          : 'This transaction is no longer active.'}
                      </Typography>
                    </div>
                    {transaction.proofPaymentUrl && (
                      <Button variant='outlined' component='a' href={transaction.proofPaymentUrl} target='_blank'>
                        View Submitted Proof
                      </Button>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <div className='flex flex-col gap-6 sticky top-8'>
            <Card>
              <CardHeader title='Order Details' className='bg-actionHover p-4' />
              <CardContent className='p-6 flex flex-col gap-4'>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography color='text.secondary'>Status</Typography>
                  <Chip
                    label={transaction.status.toUpperCase()}
                    color={getStatusColor(transaction.status)}
                    variant='tonal'
                  />
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color='text.secondary'>Payment Method</Typography>
                  <Typography fontWeight='bold'>{transaction.paymentMethod?.name || 'Manual Transfer'}</Typography>
                </Box>
                <Divider />
                <Box display='flex' justifyContent='space-between' alignItems='center' py={2}>
                  <Typography variant='h6' fontWeight='bold'>Total Paid</Typography>
                  <Typography variant='h4' fontWeight='900' color='primary'>
                    {formatRupiah(transaction.totalAmount || 0)}
                  </Typography>
                </Box>
                
                {transaction.status === 'pending' && (
                  <LoadingButton
                    fullWidth
                    color='error'
                    variant='outlined'
                    onClick={handleCancel}
                    loading={cancelling}
                    startIcon={<i className='ri-close-line' />}
                  >
                    Cancel Transaction
                  </LoadingButton>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader title='Need Help?' className='bg-actionHover p-4' />
              <CardContent className='p-6'>
                <Typography variant='body2' className='mb-4'>
                  If you have issues with your payment or booking details, our support team is available 24/7.
                </Typography>
                <Button fullWidth startIcon={<i className='ri-customer-service-2-line' />} variant='outlined'>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default TransactionDetailsPage
