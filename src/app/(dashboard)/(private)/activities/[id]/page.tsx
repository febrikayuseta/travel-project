// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

// Component Imports
import { AddToCartButton } from '@/components/travel/AddToCartButton'
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Type Imports
import type { Activity } from '@/types/project-types'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getActivity(id: string): Promise<Activity | null> {
  if (!API_BASE || !API_KEY) return null
  try {
    const response = await fetch(`${API_BASE}/api/v1/activity/${id}`, {
      headers: { apiKey: API_KEY },
      cache: 'no-store'
    })
    if (!response.ok) return null
    const json = await response.json()
    return parseApiData<Activity>(json)
  } catch (error) {
    console.error(`Error fetching activity ${id}:`, error)
    return null
  }
}

const ActivityDetailPage = async ({ params }: { params: { id: string } }) => {
  const activity = await getActivity(params.id)

  if (!activity) {
    return (
      <div className='p-6 text-center py-20'>
        <i className='ri-error-warning-line text-6xl text-error mb-4 block' />
        <Typography variant='h4' fontWeight='bold' gutterBottom>Activity not found</Typography>
        <Typography color='textSecondary'>The adventure you're looking for may have been moved or deleted.</Typography>
      </div>
    )
  }

  // Handle both possible discount keys from the API
  const discount = activity.price_discount || (activity as any).discount_price || 0
  const finalPrice = discount > 0 ? activity.price - discount : activity.price

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Card className='rounded-3xl overflow-hidden shadow-xl border border-divider'>
          <div className='relative bs-[400px]'>
            <ServerSafeImage 
              src={activity.imageUrls?.[0] || ''} 
              alt={activity.title} 
              height={400} 
            />
            <div className='absolute bottom-6 left-6'>
              <Chip 
                label={activity.city} 
                className='bg-white/90 backdrop-blur-md font-bold text-primary shadow-lg dark:bg-black/60 dark:text-white'
              />
            </div>
          </div>
          <CardContent className='p-8'>
            <Typography variant='h3' fontWeight='900' className='mb-4 tracking-tight'>
              {activity.title}
            </Typography>
            <div className='flex items-center gap-4 mb-6'>
              <div className='flex items-center gap-1 text-yellow-500'>
                <i className='ri-star-fill text-xl' />
                <Typography variant='h6' fontWeight='bold' color='textPrimary'>
                  {activity.rating || 0}
                </Typography>
              </div>
              <Typography color='textSecondary' fontWeight='medium'>
                ({activity.total_reviews || 0} Reviews)
              </Typography>
              <Divider orientation='vertical' flexItem sx={{ mx: 1 }} />
              <Typography className='flex items-center gap-2' color='textSecondary' fontWeight='medium'>
                <i className='ri-map-pin-2-fill text-primary/60' /> {activity.province}
              </Typography>
            </div>
            
            <Typography variant='h5' fontWeight='bold' className='mb-3 text-primary'>Description</Typography>
            <Typography variant='body1' color='textSecondary' className='leading-loose mb-10 text-lg'>
              {activity.description}
            </Typography>

            <Divider className='mb-10' />

            <Typography variant='h5' fontWeight='bold' className='mb-4 text-primary'>Facilities</Typography>
            <div 
              className='bg-actionHover p-8 rounded-3xl mb-10 border border-divider leading-relaxed'
              dangerouslySetInnerHTML={{ __html: activity.facilities }} 
            />

            <Typography variant='h5' fontWeight='bold' className='mb-4 text-primary'>Location</Typography>
            <div className='rounded-3xl overflow-hidden shadow-lg bs-[450px] bg-actionHover relative border border-divider mb-4'>
                {(() => {
                  const mapInput = activity.location_maps || ''
                  
                  // Check if the map is a clean iframe or needs processing
                  if (mapInput.includes('<iframe')) {
                      return (
                        <div 
                          className='bs-full is-full [&>iframe]:bs-full [&>iframe]:is-full [&>iframe]:border-0'
                          dangerouslySetInnerHTML={{ __html: mapInput }} 
                        />
                      )
                  }

                  // Robust fallback to search if the map string is broken or 404-prone
                  const query = encodeURIComponent(`${activity.title}, ${activity.address || ''}, ${activity.city}, ${activity.province}`)
                  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${query}`
                  
                  // If we don't have an iframe, we use the Embed API for reliability
                  return (
                    <iframe
                      title='Location Map'
                      src={mapInput.includes('google.com/maps') && !mapInput.includes('embed') ? `${mapInput}&output=embed` : `https://maps.google.com/maps?q=${query}&output=embed`}
                      className='bs-full is-full border-0'
                      allowFullScreen
                      loading='lazy'
                    />
                  )
                })()}
            </div>
            <Typography variant='body1' className='mt-6 p-4 bg-actionHover/50 rounded-xl flex items-center gap-3' color='textPrimary' fontWeight='bold'>
              <i className='ri-road-map-fill text-primary text-xl' /> {activity.address}, {activity.city}, {activity.province}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Card className='rounded-3xl shadow-2xl sticky top-8 border border-divider overflow-hidden'>
          <CardHeader 
            title={<Typography variant='h5' fontWeight='bold' className='uppercase tracking-wider'>Booking Details</Typography>} 
            className='bg-primary text-white px-8 py-6'
          />
          <CardContent className='p-8 flex flex-col gap-8'>
            <Box>
              <Typography variant='caption' color='textSecondary' fontWeight='bold' className='block mb-2 uppercase tracking-widest'>PRICE PER PERSON</Typography>
              <div className='flex flex-col gap-2'>
                <Typography variant='h2' color='primary' fontWeight='900' className='tracking-tighter'>
                  {formatRupiah(finalPrice)}
                </Typography>
                {discount > 0 && (
                  <Typography variant='h6' className='line-through text-textDisabled font-bold flex items-center gap-2'>
                    <i className='ri-price-tag-3-line' /> {formatRupiah(activity.price)}
                  </Typography>
                )}
              </div>
            </Box>

            <Divider />

            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-3 text-success p-3 bg-success/5 rounded-xl'>
                <i className='ri-checkbox-circle-fill text-xl' />
                <Typography variant='body1' fontWeight='bold'>Instant Confirmation</Typography>
              </div>
              <div className='flex items-center gap-3 text-info p-3 bg-info/5 rounded-xl'>
                <i className='ri-calendar-check-fill text-xl' />
                <Typography variant='body1' fontWeight='bold'>Flexible Booking</Typography>
              </div>
            </div>

            <AddToCartButton activityId={activity.id} />

            <Typography variant='caption' color='textDisabled' className='text-center block mt-3 font-medium uppercase tracking-widest opacity-60'>
              Prices include all taxes and fees.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ActivityDetailPage
