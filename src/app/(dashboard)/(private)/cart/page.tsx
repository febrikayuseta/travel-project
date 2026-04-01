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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { toast } from 'react-toastify'

// Type Imports
import type { Cart, PaymentMethod } from '@/types/project-types'

// Utils Imports
import { formatRupiah, parseApiData } from '@/utils/apiUtils'

const ProductImage = styled('img')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  borderRadius: '8px'
})

const CartPage = () => {
  // States
  const [carts, setCarts] = useState<Cart[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  // Hooks
  const router = useRouter()

  const fetchCarts = async () => {
    try {
      const res = await fetch('/api/proxy/carts')
      const json = await res.json()
      if (res.ok) {
        setCarts(parseApiData<Cart[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch carts:', error)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch('/api/proxy/payment-methods')
      const json = await res.json()
      if (res.ok) {
        const methods = parseApiData<PaymentMethod[]>(json)
        setPaymentMethods(methods)
        if (methods.length > 0) {
          setSelectedPaymentMethod(methods[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchCarts(), fetchPaymentMethods()])
      setLoading(false)
    }
    init()
  }, [])

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return
    try {
      const res = await fetch(`/api/proxy/update-cart/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })
      if (res.ok) {
        toast.success('Cart updated')
        fetchCarts()
      } else {
        toast.error('Failed to update cart')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/proxy/delete-cart/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Item removed')
        fetchCarts()
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleCheckout = async () => {
    if (!selectedPaymentMethod || carts.length === 0) return
    
    setProcessing(true)
    try {
      const cartIds = carts.map(c => c.id)
      const res = await fetch('/api/proxy/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartIds, paymentMethodId: selectedPaymentMethod })
      })
      const json = await res.json()
      
      if (res.ok) {
        toast.success('Checkout successful!')
        const transactionId = json.data?.id || json.id
        if (transactionId) {
          router.push(`/transactions/${transactionId}`)
        } else {
          router.push('/transactions')
        }
      } else {
        toast.error(json.message || 'Checkout failed')
      }
    } catch (error) {
      toast.error('An error occurred during checkout')
    } finally {
      setProcessing(false)
    }
  }

  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [applyingPromo, setApplyingPromo] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode) return
    setApplyingPromo(true)
    try {
      const res = await fetch('/api/proxy/promos')
      const json = await res.json()
      if (res.ok) {
        const promos = parseApiData<any[]>(json)
        const found = promos.find(p => p.promo_code.toLowerCase() === promoCode.toLowerCase())
        
        if (found) {
          if (totalPrice < found.minimum_claim_price) {
            toast.error(`Minimum transaction for this promo is ${formatRupiah(found.minimum_claim_price)}`)
            setDiscount(0)
          } else {
            setDiscount(found.promo_discount_price)
            toast.success('Promo applied successfully!')
          }
        } else {
          toast.error('Invalid promo code')
          setDiscount(0)
        }
      }
    } catch (error) {
      toast.error('Failed to validate promo')
    } finally {
      setApplyingPromo(false)
    }
  }

  const totalItems = carts.reduce((acc, cart) => acc + cart.quantity, 0)
  const totalPrice = carts.reduce((acc, cart) => {
    const price = cart.activity ? (cart.activity.price_discount > 0 ? cart.activity.price - cart.activity.price_discount : cart.activity.price) : 0
    return acc + price * cart.quantity
  }, 0)
  const finalTotal = Math.max(0, totalPrice - discount)

  if (loading) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <Skeleton variant='rectangular' height={200} />
        <Skeleton variant='rectangular' height={100} />
        <Skeleton variant='rectangular' height={100} />
      </div>
    )
  }

  if (carts.length === 0) {
    return (
      <Card className='text-center p-12'>
        <CardContent className='flex flex-col items-center gap-6'>
          <div className='bg-primaryLight p-6 rounded-full'>
            <i className='ri-shopping-cart-2-line text-primary text-[64px]' />
          </div>
          <Typography variant='h4' fontWeight='bold'>
            Your cart is empty
          </Typography>
          <Typography color='text.secondary'>
            Looks like you haven't added any activities to your cart yet.
          </Typography>
          <Button variant='contained' component={Link} href='/dashboard' size='large' className='rounded-full px-10'>
            Explore Activities
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <Typography variant='h3' fontWeight='bold' className='mb-2'>
          Checkout Cart
        </Typography>
        <Typography color='text.secondary'>
          Review your chosen activities and complete your booking seamlessly.
        </Typography>
      </div>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={8}>
          <div className='flex flex-col gap-4'>
            {carts.map(cart => {
              const price = cart.activity ? (cart.activity.price_discount > 0 ? cart.activity.price - cart.activity.price_discount : cart.activity.price) : 0
              return (
                <Card key={cart.id}>
                  <CardContent className='flex flex-col sm:flex-row items-center gap-6'>
                    {cart.activity?.imageUrls?.[0] ? (
                      <ProductImage src={cart.activity.imageUrls[0]} alt={cart.activity.title} />
                    ) : (
                      <div className='bg-actionHover w-[100px] h-[100px] rounded-[8px] flex items-center justify-center text-textDisabled'>
                        No Image
                      </div>
                    )}
                    
                    <div className='flex-grow min-w-0'>
                      <Typography variant='h5' fontWeight='600' className='mb-1 truncate hover:text-primary cursor-pointer' component={Link} href={`/apps/ecommerce/products/details/${cart.activityId}`}>
                        {cart.activity?.title || 'Cart Item'}
                      </Typography>
                      <Typography variant='body2' className='flex items-center gap-1 mb-2' color='text.secondary'>
                        <i className='ri-map-pin-line' /> {cart.activity?.city}, {cart.activity?.province}
                      </Typography>
                      <Typography variant='h6' color='primary' fontWeight='bold'>
                        {formatRupiah(price)} <span className='text-xs text-textDisabled font-normal'>/ item</span>
                      </Typography>
                    </div>

                    <div className='flex flex-col items-end gap-3'>
                      <div className='flex items-center border rounded-lg bg-actionHover'>
                        <IconButton size='small' onClick={() => handleUpdateQuantity(cart.id, cart.quantity - 1)} disabled={cart.quantity <= 1}>
                          <i className='ri-subtract-line text-lg' />
                        </IconButton>
                        <Typography className='px-4 font-bold'>{cart.quantity}</Typography>
                        <IconButton size='small' onClick={() => handleUpdateQuantity(cart.id, cart.quantity + 1)}>
                          <i className='ri-add-line text-lg' />
                        </IconButton>
                      </div>
                      <Button color='error' startIcon={<i className='ri-delete-bin-line' />} onClick={() => handleDeleteItem(cart.id)}>
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card className='sticky top-8 shadow-xl rounded-3xl overflow-hidden border border-divider'>
            <CardHeader 
              title={<Typography variant='h5' fontWeight='bold'>Order Summary</Typography>} 
              className='bg-actionHover p-6 px-8' 
            />
            <Divider />
            <CardContent className='p-8 flex flex-col gap-6'>
              <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                  <Typography color='text.secondary' className='text-lg'>Selected Items</Typography>
                  <Typography fontWeight='800' className='text-lg'>{totalItems}</Typography>
                </div>
                <div className='flex justify-between items-center'>
                  <Typography color='text.secondary' className='text-lg'>Total Price</Typography>
                  <Typography fontWeight='800' className='text-lg'>{formatRupiah(totalPrice)}</Typography>
                </div>
                {discount > 0 && (
                  <div className='flex justify-between items-center text-success'>
                    <Typography color='success.main' className='text-lg'>Promo Discount</Typography>
                    <Typography fontWeight='800' className='text-lg font-bold'>- {formatRupiah(discount)}</Typography>
                  </div>
                )}
              </div>

              <Divider className='opacity-50' />

              {/* Promo Code Input */}
              <div className='flex flex-col gap-3'>
                <Typography variant='subtitle1' fontWeight='800' className='flex items-center gap-2'>
                  <i className='ri-coupon-line text-primary' /> Have a Promo Code?
                </Typography>
                <div className='flex gap-2'>
                  <TextField 
                    fullWidth 
                    size='small' 
                    placeholder='Enter code' 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                        '& input': { color: 'grey.900', fontWeight: 'bold' }
                      }
                    }}
                  />
                  <Button 
                    variant='outlined' 
                    onClick={handleApplyPromo}
                    disabled={applyingPromo || !promoCode}
                  >
                    {applyingPromo ? <CircularProgress size={20} /> : 'Apply'}
                  </Button>
                </div>
              </div>

              <Divider className='opacity-50' />

              <div className='flex flex-col gap-4'>
                <Typography variant='subtitle1' fontWeight='800' className='flex items-center gap-2'>
                  <i className='ri-bank-card-line text-primary' /> Payment Method
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id='payment-method-label'>Choose Method</InputLabel>
                  <Select
                    labelId='payment-method-label'
                    value={selectedPaymentMethod}
                    label='Choose Method'
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className='rounded-xl'
                  >
                    {paymentMethods.map(method => (
                      <MenuItem key={method.id} value={method.id}>
                        {method.name}
                      </MenuItem>
                    ))}
                    {paymentMethods.length === 0 && <MenuItem value='' disabled>No methods available</MenuItem>}
                  </Select>
                </FormControl>
              </div>

              <Divider className='opacity-50' />

              <div className='flex justify-between items-center bg-primary/5 p-4 rounded-2xl border border-primary/10'>
                <Typography variant='h6' fontWeight='800'>
                  Total Payment
                </Typography>
                <Typography variant='h3' color='primary' fontWeight='900'>
                  {formatRupiah(finalTotal)}
                </Typography>
              </div>

              <Button
                fullWidth
                variant='contained'
                size='large'
                className='py-5 font-black text-xl rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all'
                onClick={handleCheckout}
                disabled={processing || carts.length === 0 || !selectedPaymentMethod}
                startIcon={processing ? <CircularProgress size={24} color='inherit' /> : <i className='ri-secure-payment-line text-2xl' />}
              >
                {processing ? 'Processing...' : 'Checkout Now'}
              </Button>
              
              <div className='flex items-center justify-center gap-2 text-textDisabled pt-2'>
                <i className='ri-shield-check-line text-xl' />
                <Typography variant='caption' fontWeight='bold' className='uppercase tracking-wider'>Secure and encrypted payment</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default CartPage
