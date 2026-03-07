// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Link from 'next/link'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Type Imports
import type { Activity, Banner, Category, Promo } from '@/types/project-types'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getPublicData<T>(path: string): Promise<T[]> {
  if (!API_BASE || !API_KEY) return []
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { apiKey: API_KEY },
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (!response.ok) return []
    const json = await response.json()
    return parseApiData<T[]>(json)
  } catch (error) {
    console.error(`Error fetching ${path}:`, error)
    return []
  }
}

const DashboardAnalytics = async () => {
  const [banners, promos, categories, activities] = await Promise.all([
    getPublicData<Banner>('/api/v1/banners'),
    getPublicData<Promo>('/api/v1/promos'),
    getPublicData<Category>('/api/v1/categories'),
    getPublicData<Activity>('/api/v1/activities')
  ])

  return (
    <Grid container spacing={6}>
      {/* Hero Section */}
      <Grid item xs={12}>
        <Card className='relative overflow-hidden bg-gradient-to-r from-primary to-info text-white shadow-xl'>
          <CardContent className='p-8 md:p-12 relative z-10'>
            <Typography variant='overline' className='text-white/80 font-bold tracking-widest'>
              TRAVEL DASHBOARD
            </Typography>
            <Typography variant='h2' className='text-white font-black mt-2 leading-tight'>
              Plan Better Trips, <span className='text-yellow-400 font-serif italic'>Faster</span>
            </Typography>
            <Typography variant='body1' className='text-white/90 mt-4 max-w-2xl text-lg'>
              Explore curated promos, categories, and activities with a cleaner booking flow for users and admins.
            </Typography>
            
            <Grid container spacing={4} className='mt-8 max-w-2xl'>
              {[
                { label: 'Banners', value: banners.length },
                { label: 'Promos', value: promos.length },
                { label: 'Categories', value: categories.length },
                { label: 'Activities', value: activities.length }
              ].map((stat, idx) => (
                <Grid item xs={6} sm={3} key={idx}>
                  <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10'>
                    <Typography variant='h4' className='text-white font-bold'>
                      {stat.value}
                    </Typography>
                    <Typography variant='caption' className='text-white/70 uppercase font-bold'>
                      {stat.label}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
          {/* Abstract Decorations */}
          <div className='absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl' />
          <div className='absolute -left-20 -bottom-20 w-60 h-60 bg-yellow-400/10 rounded-full blur-3xl' />
        </Card>
      </Grid>

      {/* Featured Banners */}
      <Grid item xs={12}>
        <div className='flex items-center justify-between mb-4'>
          <Typography variant='h4' fontWeight='bold'>Featured Banners</Typography>
          <Chip label='Live API' variant='outlined' size='small' color='info' />
        </div>
        <Grid container spacing={6}>
          {banners.slice(0, 3).map(banner => (
            <Grid item xs={12} sm={6} md={4} key={banner.id}>
              <Card className='group hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden h-full'>
                <ServerSafeImage 
                  src={banner.imageUrl} 
                  alt={banner.name} 
                  height={192} // h-48 is 12rem = 192px
                >
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                </ServerSafeImage>
                <CardContent className='p-6'>
                  <Typography variant='h6' fontWeight='bold' className='line-clamp-1'>
                    {banner.name}
                  </Typography>
                  <Button
                    component={Link}
                    href={`/banners/${banner.id}`}
                    size='small'
                    className='mt-3 normal-case'
                    color='info'
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Best Promos */}
      <Grid item xs={12}>
        <Typography variant='h4' fontWeight='bold' className='mb-4'>Best Promos</Typography>
        <Grid container spacing={6}>
          {promos.slice(0, 6).map(promo => (
            <Grid item xs={12} sm={6} md={4} key={promo.id}>
              <Card className='hover:shadow-xl transition-shadow rounded-3xl border border-primary/5 h-full'>
                <CardContent className='p-6 flex flex-col h-full'>
                  <div className='mb-4'>
                    <Chip
                      label={`Save ${formatRupiah(promo.promo_discount_price)}`}
                      color='primary'
                      size='small'
                      className='font-bold'
                    />
                  </div>
                  <Typography variant='h5' fontWeight='800' className='line-clamp-2 mb-3 leading-tight'>
                    {promo.title}
                  </Typography>
                  <Typography variant='body2' className='text-textSecondary mb-4'>
                    Min. spend {formatRupiah(promo.minimum_claim_price)}
                  </Typography>
                  <div className='mt-auto'>
                    <Button
                      component={Link}
                      href={`/promos/${promo.id}`}
                      variant='contained'
                      fullWidth
                      className='rounded-xl py-2'
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Popular Activities */}
      <Grid item xs={12}>
        <Typography variant='h4' fontWeight='bold' className='mb-4'>Popular Activities</Typography>
        <Grid container spacing={6}>
          {activities.slice(0, 6).map(activity => (
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <Card className='group hover:shadow-2xl transition-all rounded-3xl overflow-hidden h-full flex flex-col'>
                {activity.imageUrls && activity.imageUrls.length > 0 && (
                  <ServerSafeImage 
                    src={activity.imageUrls[0]} 
                    alt={activity.title} 
                    city={activity.city}
                    height={224} // h-56 is 14rem = 224px
                  />
                )}
                <CardContent className='p-6 flex-grow flex flex-col'>
                  <Typography variant='h6' fontWeight='bold' className='line-clamp-1 mb-1'>
                    {activity.title}
                  </Typography>
                  <div className='flex items-center gap-1 mb-4'>
                    <i className='ri-star-fill text-yellow-500' />
                    <Typography variant='body2' fontWeight='bold'>{activity.rating || 0}</Typography>
                    <Typography variant='caption' color='textSecondary'>({activity.total_reviews || 0} reviews)</Typography>
                  </div>
                  <div className='mt-auto flex items-center justify-between pt-4 border-t border-divider'>
                    <div>
                      <Typography variant='caption' color='textSecondary' className='block'>Starting from</Typography>
                      <Typography variant='h6' color='primary' fontWeight='900'>
                        {formatRupiah(activity.price)}
                      </Typography>
                    </div>
                    <Button
                      component={Link}
                      href={`/activities/${activity.id}`}
                      variant='outlined'
                      className='rounded-xl'
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DashboardAnalytics
