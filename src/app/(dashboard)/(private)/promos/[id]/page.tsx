// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'
import RedeemButton from '@/components/travel/RedeemButton'

// Type Imports
import type { Promo } from '@/types/project-types'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getPromo(id: string): Promise<Promo | null> {
  if (!API_BASE || !API_KEY) return null
  try {
    const response = await fetch(`${API_BASE}/api/v1/promo/${id}`, {
      headers: { apiKey: API_KEY },
      cache: 'no-store'
    })
    if (!response.ok) return null
    const json = await response.json()
    return parseApiData<Promo>(json)
  } catch (error) {
    console.error(`Error fetching promo ${id}:`, error)
    return null
  }
}

const PromoDetailPage = async ({ params }: { params: { id: string } }) => {
  const promo = await getPromo(params.id)

  if (!promo) {
    return (
      <div className='p-6'>
        <Typography variant='h4'>Promo not found</Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Card className='rounded-3xl overflow-hidden shadow-xl border border-primary/5 h-full'>
          <div className='relative bs-[400px]'>
            <ServerSafeImage 
              src={promo.imageUrl} 
              alt={promo.title} 
              height={400} 
            />
            <div className='absolute bottom-6 left-6'>
              <Chip 
                label={`DISCOUNT ${formatRupiah(promo.promo_discount_price)}`} 
                color='primary' 
                className='font-black shadow-lg shadow-primary/20 p-2'
              />
            </div>
          </div>
          <CardContent className='p-12'>
            <div className='mb-8'>
               <Typography variant='h2' fontWeight='900' className='leading-tight mb-4 text-primary tracking-tight'>
                 {promo.title}
               </Typography>
               <Typography variant='body1' className='text-xl italic text-textSecondary opacity-80 leading-relaxed font-serif'>
                 &quot;Unlock incredible savings with our exclusive travel offer tailored for your next adventure.&quot;
               </Typography>
            </div>
            
            <Divider className='mb-10 opacity-10' />
            
            <div className='mb-12'>
              <Typography variant='h4' fontWeight='bold' className='mb-6 flex items-center gap-3'>
                <i className='ri-information-line text-primary' /> Promo Details
              </Typography>
              <Typography variant='body1' color='textSecondary' className='text-lg leading-loose mb-10'>
                {promo.description}
              </Typography>
              
              <div className='bg-primary/5 p-10 rounded-[32px] border border-primary/10 shadow-inner group transition-all hover:bg-primary/10 cursor-default'>
                 <Typography variant='h5' fontWeight='bold' className='mb-8 flex items-center gap-2 group-hover:text-primary transition-colors'>
                   <i className='ri-file-list-3-line text-2xl' /> Terms & Conditions
                 </Typography>
                 <div 
                   className='text-lg leading-relaxed text-textSecondary overflow-hidden'
                   dangerouslySetInnerHTML={{ __html: promo.terms_condition }} 
                 />
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Card className='rounded-3xl shadow-xl border border-primary/5 sticky top-8'>
          <CardHeader 
            title={<Typography variant='h5' fontWeight='black' className='uppercase tracking-widest text-primary'>Deal Summary</Typography>} 
            className='bg-primary/5 px-8 py-6'
          />
          <Divider />
          <CardContent className='p-8 flex flex-col gap-10'>
            <div className='text-center p-8 bg-actionHover rounded-3xl border border-divider shadow-sm'>
               <Typography variant='caption' className='block opacity-60 font-bold uppercase tracking-wider mb-2'>YOUR PROMO CODE</Typography>
               <Typography variant='h2' className='text-primary font-black tracking-[4px] bg-white py-4 rounded-2xl shadow-inner border border-primary/10'>
                 {promo.promo_code}
               </Typography>
               <Typography variant='caption' className='block mt-4 text-primary font-bold'>COPIED AUTOMATICALLY AT CHECKOUT</Typography>
            </div>

            <div className='flex flex-col gap-6 py-4'>
               <div className='flex justify-between items-center group'>
                  <Typography color='textSecondary' className='text-lg'>Max Discount</Typography>
                  <Typography variant='h5' fontWeight='900' color='primary' className='group-hover:scale-110 transition-transform'>
                    {formatRupiah(promo.promo_discount_price)}
                  </Typography>
               </div>
               <div className='flex justify-between items-center group'>
                  <Typography color='textSecondary' className='text-lg'>Min. Transaction</Typography>
                  <Typography variant='h5' fontWeight='900' className='group-hover:scale-110 transition-transform'>
                    {formatRupiah(promo.minimum_claim_price)}
                  </Typography>
               </div>
            </div>

            <Divider />

            <div className='flex flex-col gap-4'>
               <RedeemButton promoCode={promo.promo_code} />
               <Button 
                component={Link} 
                href='/dashboard' 
                variant='outlined' 
                size='large' 
                className='rounded-2xl px-12 py-4 font-bold text-lg hover:bg-white transition-all'
               >
                 View All Offers
               </Button>
            </div>

            <div className='flex items-center justify-center gap-3 opacity-30 mt-4'>
               <i className='ri-verified-badge-line text-2xl' />
               <Typography variant='caption' fontWeight='bold'>GUARANTEED VERIFIED OFFER</Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PromoDetailPage
