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

// Type Imports
import type { PaymentMethod } from '@/types/project-types'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'

const PaymentMethodList = () => {
  // States
  const [data, setData] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20'>
        <CircularProgress size={60} thickness={4} />
        <Typography className='mt-6 text-xl font-bold opacity-40'>Scanning Gateway Infrastructure...</Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      {data.map(method => (
        <Grid item xs={12} sm={6} md={4} key={method.id}>
          <Card className='rounded-[32px] overflow-hidden shadow-xl border border-divider h-full flex flex-col group hover:border-primary/50 transition-all'>
            <CardContent className='p-8 flex-grow'>
              <div className='flex items-center justify-between mb-6'>
                <div className='bg-primary/5 p-4 rounded-2xl'>
                   <i className='ri-bank-card-2-line text-4xl text-primary' />
                </div>
                <div className='w-4 h-4 rounded-full bg-success shadow-lg shadow-success/20' title='System Active' />
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
                variant='tonal' 
                fullWidth 
                size='large' 
                className='rounded-2xl font-black uppercase text-xs tracking-widest group-hover:bg-primary group-hover:text-white transition-all'
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
  )
}

export default PaymentMethodList
