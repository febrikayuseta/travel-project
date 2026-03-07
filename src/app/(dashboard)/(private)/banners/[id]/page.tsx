// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Link from 'next/link'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Type Imports
import type { Banner } from '@/types/project-types'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getBanner(id: string): Promise<Banner | null> {
  if (!API_BASE || !API_KEY) return null
  try {
    const response = await fetch(`${API_BASE}/api/v1/banner/${id}`, {
      headers: { apiKey: API_KEY },
      cache: 'no-store'
    })
    if (!response.ok) return null
    const json = await response.json()
    return parseApiData<Banner>(json)
  } catch (error) {
    console.error(`Error fetching banner ${id}:`, error)
    return null
  }
}

const BannerDetailPage = async ({ params }: { params: { id: string } }) => {
  const banner = await getBanner(params.id)

  if (!banner) {
    return (
      <div className='p-6'>
        <Typography variant='h4'>Banner not found</Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='rounded-3xl overflow-hidden shadow-xl border border-primary/5'>
          <div className='relative bs-[500px]'>
            <ServerSafeImage 
              src={banner.imageUrl} 
              alt={banner.name} 
              height={500} 
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
            <div className='absolute bottom-12 left-12 right-12'>
              <div className='mb-6'>
                <Chip label='FEATURED ADVENTURE' color='primary' className='font-black tracking-widest' />
              </div>
              <Typography variant='h1' className='text-white font-black drop-shadow-lg mb-4 leading-none' style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                {banner.name}
              </Typography>
              <Typography variant='h5' className='text-white/80 max-w-2xl font-light italic leading-relaxed'>
                Embark on an extraordinary journey to {banner.name}. Discover curated experiences and create memories that will stay with you forever.
              </Typography>
            </div>
          </div>
          <CardContent className='p-12 bg-actionHover flex flex-col items-center text-center'>
            <div className='bg-primary/5 p-10 rounded-[48px] max-w-3xl border border-primary/10 shadow-inner'>
               <i className='ri-flight-takeoff-line text-primary text-[80px] mb-6 block opacity-40' />
               <Typography variant='h4' fontWeight='bold' className='mb-8 text-primary'>
                 Ready to Start Your Journey?
               </Typography>
               <Typography color='textSecondary' className='text-lg mb-10'>
                 Explore our exclusive activities and packages tailored for {banner.name}. 
                 Unlock special deals and guaranteed best prices for your next trip.
               </Typography>
               <div className='flex gap-4 justify-center'>
                 <Button 
                   component={Link} 
                   href='/dashboard' 
                   variant='contained' 
                   size='large' 
                   className='rounded-2xl px-12 py-4 font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all'
                 >
                   Explore Activities
                 </Button>
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
            </div>
            
            <div className='mt-16 flex gap-8 flex-wrap justify-center border-t border-divider pt-12 w-full max-w-4xl'>
               {[
                 { icon: 'ri-global-line', title: 'Global Coverage' },
                 { icon: 'ri-shield-check-line', title: 'Trusted Network' },
                 { icon: 'ri-customer-service-2-line', title: '24/7 Premium Support' }
               ].map((item, idx) => (
                 <div key={idx} className='flex items-center gap-3 bg-white py-4 px-8 rounded-2xl shadow-md border border-divider hover:shadow-lg transition-all cursor-default group'>
                    <i className={`${item.icon} text-2xl text-primary group-hover:scale-110 transition-transform`} />
                    <Typography fontWeight='800' className='whitespace-nowrap' sx={{ color: 'grey.900' }}>
                      {item.title}
                    </Typography>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default BannerDetailPage
