'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// Third-party Imports
import { toast } from 'react-toastify'

type Notice = {
  type: 'success' | 'error'
  message: string
}

export function AddToCartButton({ activityId }: { activityId: string }) {
  // States
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Hooks
  const router = useRouter()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/add-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activityId })
      })

      const json = await res.json()

      if (res.ok) {
        toast.success('Activity added to cart!')
        setSuccess(true)
      } else {
        toast.error(json.message || 'Failed to add to cart')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <Button
        variant='contained'
        fullWidth
        size='large'
        onClick={handleAddToCart}
        disabled={loading}
        className='h-14 font-bold rounded-2xl shadow-lg shadow-primary/20'
        startIcon={loading ? <CircularProgress size={20} color='inherit' /> : <i className='ri-shopping-cart-2-line' />}
      >
        {loading ? 'Adding to cart...' : 'Add to Cart'}
      </Button>

      {success && (
        <Button
          variant='outlined'
          fullWidth
          onClick={() => router.push('/cart')}
          className='rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10'
          startIcon={<i className='ri-arrow-right-line' />}
        >
          View Cart & Checkout
        </Button>
      )}
    </div>
  )
}
