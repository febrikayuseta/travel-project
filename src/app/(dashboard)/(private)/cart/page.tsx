'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'

// Third-party Imports
import { toast } from 'react-toastify'

// Type Imports
import type { Cart, PaymentMethod, Promo } from '@/types/project-types'

// Utils Imports
import { formatRupiah, parseApiData } from '@/utils/apiUtils'

const CartPage = () => {
  // States
  const [carts, setCarts] = useState<Cart[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  
  // Promo States
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  // Hooks
  const router = useRouter()

  const fetchCartData = async () => {
    try {
      const res = await fetch('/api/proxy/carts')
      const json = await res.json()
      if (res.ok) {
        setCarts(parseApiData<Cart[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch('/api/proxy/payment-methods')
      const json = await res.json()
      if (res.ok) {
        const data = parseApiData<PaymentMethod[]>(json)
        setPaymentMethods(data)
        if (data.length > 0) setSelectedPaymentMethod(data[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchCartData(), fetchPaymentMethods()])
      setLoading(false)
    }
    init()
  }, [])

  const handleUpdateQuantity = async (cartId: string, newQty: number) => {
    if (newQty < 1) return
    try {
      const res = await fetch(`/api/proxy/update-cart/${cartId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      })
      if (res.ok) {
        fetchCartData()
      }
    } catch (error) {
      toast.error('Failed to update quantity')
    }
  }

  const handleDeleteItem = async (cartId: string) => {
    try {
      const res = await fetch(`/api/proxy/delete-cart/${cartId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Item removed from cart')
        fetchCartData()
      }
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode) return
    setPromoLoading(true)
    try {
      const res = await fetch('/api/proxy/promos')
      const json = await res.json()
      if (res.ok) {
        const promos = parseApiData<Promo[]>(json)
        const match = promos.find(p => p.promo_code.toLowerCase() === promoCode.toLowerCase())
        
        if (!match) {
          toast.error('Invalid promo code')
          setAppliedPromo(null)
        } else if (subtotal < match.minimum_claim_price) {
          toast.error(`Minimum spend for this promo is ${formatRupiah(match.minimum_claim_price)}`)
          setAppliedPromo(null)
        } else {
          setAppliedPromo(match)
          toast.success('Promo code applied!')
        }
      }
    } catch (error) {
      toast.error('Could not validate promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/proxy/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartIds: carts.map(c => c.id),
          cart_id: carts.map(c => c.id),
          paymentMethodId: selectedPaymentMethod,
          payment_method_id: selectedPaymentMethod,
          promoId: appliedPromo?.id || undefined,
          promo_id: appliedPromo?.id || undefined
        })
      })

      const json = await res.json()

      if (res.ok) {
        toast.success('Booking created successfully!')
        const payload = parseApiData<any>(json)
        const txId = payload.id || (payload.data && payload.data.id) || json.data?.id || (typeof json.data === 'string' ? json.data : null)
        
        // Sticky Promo: Save by both txId and subtotal for robust matching
        if (txId && appliedPromo) {
          try {
            const stickyPromos = JSON.parse(localStorage.getItem('sticky_promos') || '{}')
            const promoInfo = {
              id: appliedPromo.id,
              code: appliedPromo.promo_code,
              discount: 100000,
              subtotal: subtotal // Store the subtotal for "Power Sync"
            }
            stickyPromos[txId] = promoInfo
            localStorage.setItem('last_booked_promo', JSON.stringify(promoInfo)) // Global last booked
            localStorage.setItem('sticky_promos', JSON.stringify(stickyPromos))
          } catch (e) {}
        }

        if (txId) {
          router.push(`/transactions/${txId}`)
        } else {
          router.push('/transactions')
        }
      } else {
        toast.error(json.message || 'Checkout failed')
      }
    } catch (error) {
      toast.error('An error occurred during checkout')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const subtotal = carts.reduce((acc, curr) => {
    const activity = curr.activity
    if (!activity) return acc
    const price = activity.price_discount > 0 ? activity.price - activity.price_discount : activity.price
    return acc + price * curr.quantity
  }, 0)

  const discountAmount = appliedPromo ? appliedPromo.promo_discount_price : 0
  const finalTotal = Math.max(0, subtotal - discountAmount)

  if (loading) {
    return (
      <div className='flex items-center justify-center min-bs-[400px]'>
        <CircularProgress />
      </div>
    )
  }

  if (carts.length === 0) {
    return (
      <Card className='text-center p-12 flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-divider'>
        <div className='bs-24 is-24 rounded-full bg-actionHover flex items-center justify-center'>
            <i className='ri-shopping-cart-2-line text-[48px] text-textSecondary opacity-40' />
        </div>
        <div>
          <Typography variant='h4' fontWeight='bold' className='mb-2'>Your cart is empty</Typography>
          <Typography color='textSecondary'>Looks like you haven't added any activities to your cart yet.</Typography>
        </div>
        <Button variant='contained' component={Link} href='/activities' size='large' className='rounded-full px-12'>
          Explore Activities
        </Button>
      </Card>
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <Typography variant='h3' fontWeight='bold' className='mb-1'>Checkout Card</Typography>
        <Typography color='textSecondary' className='text-lg'>Review your chosen activities and complete your booking seamlessly.</Typography>
      </div>

      <Grid container spacing={8}>
        {/* Left Side: Cart Items */}
        <Grid item xs={12} lg={8}>
          <div className='flex flex-col gap-4'>
            {carts.map(item => {
              const activity = item.activity
              if (!activity) return null
              const price = activity.price_discount > 0 ? activity.price - activity.price_discount : activity.price

              return (
                <Card key={item.id} className='overflow-hidden border-divider shadow-sm hover:shadow-md transition-shadow'>
                  <CardContent className='flex gap-6 p-4 sm:p-6 items-center'>
                    <img 
                      src={activity.imageUrls[0]} 
                      alt={activity.title} 
                      className='bs-[100px] is-[100px] rounded-2xl object-cover shrink-0'
                    />
                    <div className='flex flex-col flex-grow min-is-0'>
                        <Typography variant='h6' fontWeight='bold' component={Link} href={`/activities/${activity.id}`} className='hover:text-primary transition-colors truncate'>
                          {activity.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary' className='flex items-center gap-1 mt-1'>
                          <i className='ri-map-pin-2-line text-xs' /> {activity.city}, {activity.province}
                        </Typography>
                        <div className='flex items-center gap-2 mt-3'>
                           <Typography variant='h6' fontWeight='900' color='primary'>
                             {formatRupiah(price)}
                           </Typography>
                           <Typography variant='caption' color='text.disabled'>/ item</Typography>
                        </div>
                    </div>

                    <div className='flex flex-col items-end gap-3 shrink-0'>
                        <div className='flex items-center border border-divider rounded-xl p-1 bg-backgroundDefault shadow-inner'>
                          <IconButton size='small' onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className='bs-8 is-8 color-inherit'>
                            <i className='ri-subtract-line text-sm' />
                          </IconButton>
                          <Typography className='w-8 text-center font-black text-sm'>{item.quantity}</Typography>
                          <IconButton size='small' onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className='bs-8 is-8 color-inherit'>
                            <i className='ri-add-line text-sm' />
                          </IconButton>
                        </div>
                        <Button 
                            color='error' 
                            size='small' 
                            variant='text'
                            startIcon={<i className='ri-delete-bin-line' />}
                            onClick={() => handleDeleteItem(item.id)}
                            className='font-bold opacity-80 hover:opacity-100'
                        >
                            Remove
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Grid>

        {/* Right Side: Summary & Payment */}
        <Grid item xs={12} lg={4}>
          <div className='flex flex-col gap-6 sticky top-8'>
            <Card className='border border-divider shadow-lg overflow-hidden'>
              <CardHeader title={<Typography variant='h6' fontWeight='bold' color='text.primary'>Order Summary</Typography>} className='bg-actionHover border-b' />
              <CardContent className='p-6 flex flex-col gap-8'>
                {/* Stats */}
                <div className='flex flex-col gap-4 text-sm pt-4'>
                  <div className='flex justify-between items-center'>
                    <Typography color='textSecondary' fontWeight='medium'>Selected Items</Typography>
                    <Typography fontWeight='bold' color='textPrimary' className='text-lg'>{carts.reduce((a,c) => a + c.quantity, 0)}</Typography>
                  </div>
                  <div className='flex justify-between items-center'>
                    <Typography color='textSecondary' fontWeight='medium'>Total Price</Typography>
                    <Typography fontWeight='bold' color='textPrimary' className='text-lg'>{formatRupiah(subtotal)}</Typography>
                  </div>
                  {appliedPromo && (
                    <div className='flex justify-between items-center text-success bg-success/5 p-3 rounded-xl border border-success/10'>
                      <Typography color='inherit' fontWeight='bold' className='flex items-center gap-2'>
                        <i className='ri-price-tag-3-fill' /> PROMO: {appliedPromo.promo_code}
                      </Typography>
                      <Typography fontWeight='900' className='text-lg'>-{formatRupiah(discountAmount)}</Typography>
                    </div>
                  )}
                </div>

                <Divider />

                {/* Promo Applier */}
                <div className='flex flex-col gap-4'>
                  <Typography variant='subtitle2' fontWeight='bold' className='flex items-center gap-2' color='text.primary'>
                    <i className='ri-coupon-3-fill text-primary text-lg' /> Have a Promo Code?
                  </Typography>
                  <Box display='flex' gap={2}>
                    <TextField 
                      fullWidth 
                      size='small' 
                      placeholder='Enter code' 
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      disabled={appliedPromo !== null}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <Button 
                        variant='contained' 
                        onClick={appliedPromo ? () => setAppliedPromo(null) : handleApplyPromo}
                        color={appliedPromo ? 'secondary' : 'primary'}
                        disabled={promoLoading || (!promoCode && !appliedPromo)}
                        className='bs-[40px] px-6 rounded-xl font-bold'
                    >
                        {promoLoading ? <CircularProgress size={20} color='inherit' /> : appliedPromo ? 'Remove' : 'Apply'}
                    </Button>
                  </Box>
                </div>

                <Divider />

                {/* Payment Method SELECT */}
                <div className='flex flex-col gap-4'>
                   <Typography variant='subtitle2' fontWeight='bold' className='flex items-center gap-2' color='text.primary'>
                    <i className='ri-bank-card-fill text-primary text-lg' /> Payment Method
                  </Typography>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='payment-method-label'>Choose Method</InputLabel>
                    <Select
                      labelId='payment-method-label'
                      value={selectedPaymentMethod}
                      label='Choose Method'
                      onChange={e => setSelectedPaymentMethod(e.target.value)}
                      className='rounded-xl'
                      sx={{ bgcolor: 'action.hover' }}
                    >
                      {paymentMethods.map(pm => (
                        <MenuItem key={pm.id} value={pm.id}>
                           {pm.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className='flex flex-col gap-4 mt-4'>
                    <div className='flex items-center justify-between pb-2'>
                        <Typography variant='h6' fontWeight='bold' color='text.secondary'>Total Payment</Typography>
                        <Typography variant='h3' fontWeight='900' color='primary' className='tracking-tighter'>
                            {formatRupiah(finalTotal)}
                        </Typography>
                    </div>

                    <LoadingButton
                      fullWidth
                      variant='contained'
                      size='large'
                      onClick={handleCheckout}
                      loading={checkoutLoading}
                      className='h-16 font-black text-xl rounded-2xl bg-primary hover:bg-primary-700 shadow-xl shadow-primary/20 transition-all border-none'
                      startIcon={!checkoutLoading && <i className='ri-shield-check-fill' />}
                    >
                      {checkoutLoading ? 'Processing...' : 'Checkout Now'}
                    </LoadingButton>

                    <Typography variant='caption' className='text-center opacity-50 flex items-center justify-center gap-2 font-bold uppercase tracking-wider mt-2'>
                      <i className='ri-lock-2-fill text-primary' /> Encrypted SSL Payment
                    </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default CartPage
