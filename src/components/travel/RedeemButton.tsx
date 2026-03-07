'use client'

import { useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'

// Third-party Imports
import { toast } from 'react-toastify'

type Props = {
  promoCode: string
}

const RedeemButton = ({ promoCode }: Props) => {
  const router = useRouter()

  const handleRedeem = () => {
    // 1. Copy to clipboard
    navigator.clipboard.writeText(promoCode)

    // 2. Show toast
    toast.success(`Promo code "${promoCode}" copied to clipboard!`)

    // 3. Redirect to activities/dashboard after a small delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <Button 
      variant='contained' 
      size='large' 
      className='py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 tracking-wider hover:scale-[1.02] transition-all'
      onClick={handleRedeem}
      fullWidth
    >
      REDEEM NOW
    </Button>
  )
}

export default RedeemButton
