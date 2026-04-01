'use client'

import { useEffect, useState } from 'react'
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
import LoadingButton from '@mui/lab/LoadingButton'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// Third-party Imports
import { toast } from 'react-toastify'

// Type Imports
import type { Transaction } from '@/types/project-types'

// Utils Imports
import { formatRupiah, parseApiData } from '@/utils/apiUtils'

const AdminTransactionDetailPage = () => {
  // Params
  const { id } = useParams()
  const router = useRouter()

  // States
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleUpdateStatus = async (status: 'success' | 'failed') => {
    if (!id) return
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/proxy/update-transaction-status/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(`Transaction ${status === 'success' ? 'Approved' : 'Rejected'} successfully!`)
        fetchTransaction()
      } else {
        toast.error(json.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred during update')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const fetchTransaction = async () => {
    if (!id) return
    try {
      const res = await fetch(`/api/proxy/transaction/${id}`)
      const json = await res.json()
      if (res.ok) {
        const data = parseApiData<Transaction>(json)
        setTransaction(data)
      } else {
        toast.error('Transaction not found')
        router.push('/admin/transactions')
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
            Manage Booking {transaction.invoiceId || `#${id.slice(0, 8)}`}
          </Typography>
          <Typography color='text.secondary'>
            Admin control for booking made on {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A'}
          </Typography>
        </div>
        <Button
          variant='outlined' 
          startIcon={<i className='ri-arrow-left-line' />}
          component={Link}
          href='/admin/transactions'
        >
          Back to Admin List
        </Button>
      </div>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={8}>
          <div className='flex flex-col gap-6'>
            <Card>
              <CardHeader title='Activities Summary' className='bg-actionHover p-4' />
              <CardContent className='p-0'>
                {(transaction.transaction_items || transaction.carts || []).map((item, idx) => {
                  const activity = (item as any).activity || item
                  const price = (item as any).price || (activity?.price_discount > 0 ? activity.price - activity.price_discount : activity?.price) || 0
                  const quantity = (item as any).quantity || 1
                  const totalItems = (transaction.transaction_items?.length || transaction.carts?.length || 0)
                  
                  return (
                    <Box key={item.id} p={4} display='flex' gap={4} alignItems='center' borderBottom={idx < totalItems - 1 ? 1 : 0} borderColor='divider'>
                      {activity?.imageUrls?.[0] ? (
                        <img src={activity.imageUrls[0]} alt={activity.title} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <Box bgcolor='actionHover' width={80} height={80} borderRadius={2} display='flex' alignItems='center' justifyContent='center' color='textDisabled'>
                          No Image
                        </Box>
                      )}
                      <Box flexGrow={1}>
                        <Typography variant='h6' fontWeight='bold'>{activity?.title || 'Unknown Activity'}</Typography>
                        <Typography variant='body2' color='text.secondary'>{quantity} x {formatRupiah(price)}</Typography>
                      </Box>
                      <Typography variant='h6' fontWeight='bold' color='primary'>
                        {formatRupiah(price * quantity)}
                      </Typography>
                    </Box>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader title='Approval Action' className='bg-actionHover p-4' />
              <CardContent className='p-6 flex flex-col gap-6'>
                {transaction.status === 'pending' ? (
                  <>
                    <Alert 
                      severity='info' 
                      icon={<i className='ri-shield-user-line' />}
                    >
                      <Typography fontWeight='bold'>Pending Verification</Typography>
                      Review the payment proof below and decide whether to approve or reject this transaction.
                    </Alert>
                    
                    <Box display='flex' flexDirection='column' gap={6} alignItems='center'>
                      {transaction.proofPaymentUrl ? (
                        <Box border='1px solid' borderColor='divider' borderRadius={2} overflow='hidden' maxWidth={500} width='100%'>
                          <img src={transaction.proofPaymentUrl} alt='Payment Proof' style={{ width: '100%', height: 'auto' }} />
                          <Box p={3} textAlign='center' className='bg-actionHover'>
                            <Button variant='contained' size='small' component='a' href={transaction.proofPaymentUrl} target='_blank' startIcon={<i className='ri-external-link-line' />}>
                              View Full Size Receipt
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Alert severity='warning' className='w-full'>
                          The user has not uploaded any payment proof yet.
                        </Alert>
                      )}

                      <Box display='flex' gap={4} width='100%'>
                        <LoadingButton
                          fullWidth
                          variant='contained'
                          color='success'
                          onClick={() => handleUpdateStatus('success')}
                          loading={updatingStatus}
                          startIcon={<i className='ri-checkbox-circle-line' />}
                          size='large'
                          sx={{ height: 56 }}
                        >
                          Approve Transaction
                        </LoadingButton>
                        <LoadingButton
                          fullWidth
                          variant='contained'
                          color='error'
                          onClick={() => handleUpdateStatus('failed')}
                          loading={updatingStatus}
                          startIcon={<i className='ri-close-circle-line' />}
                          size='large'
                          sx={{ height: 56 }}
                        >
                          Reject Transaction
                        </LoadingButton>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box display='flex' flexDirection='column' gap={4} alignItems='center' textAlign='center' py={6}>
                    <i className={transaction.status === 'success' ? 'ri-checkbox-circle-line text-success text-[80px]' : 'ri-close-circle-line text-error text-[80px]'} />
                    <div>
                      <Typography variant='h5' fontWeight='bold' gutterBottom>
                        Transaction {transaction.status === 'success' ? 'Already Approved' : 'Rejected/Cancelled'}
                      </Typography>
                      <Typography color='text.secondary'>
                        Current status: <Chip label={transaction.status.toUpperCase()} color={getStatusColor(transaction.status)} size='small' variant='tonal' className='font-bold' />
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
              <CardHeader title='Order Overview' className='bg-actionHover p-4' />
              <CardContent className='flex flex-col gap-4 p-6'>
                <Box sx={{ pt: 4 }} />
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <Typography color='text.secondary'>Current Status</Typography>
                  <Chip
                    label={transaction.status.toUpperCase()}
                    color={getStatusColor(transaction.status)}
                    variant='tonal'
                  />
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color='text.secondary'>Payment Method</Typography>
                  <Typography fontWeight='bold'>{transaction.paymentMethod?.name || transaction.payment_method?.name || 'Manual Transfer'}</Typography>
                </Box>
                <Divider />
                <Box display='flex' justifyContent='space-between' alignItems='center' py={2}>
                  <Typography variant='h6' fontWeight='bold'>Total Amount</Typography>
                  <Typography variant='h4' fontWeight='900' color='primary'>
                    {formatRupiah(transaction.totalAmount || 0)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title='Customer Info' className='bg-actionHover p-4' />
              <CardContent className='p-6'>
                 <Typography variant='body2' color='textSecondary' gutterBottom>
                   Booking ID:
                 </Typography>
                 <Typography fontWeight='bold' className='mb-4'>
                   {transaction.id}
                 </Typography>
                 <Typography variant='body2' color='textSecondary' gutterBottom>
                   Invoice Number:
                 </Typography>
                 <Typography fontWeight='bold'>
                   {transaction.invoiceId || 'N/A'}
                 </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default AdminTransactionDetailPage
