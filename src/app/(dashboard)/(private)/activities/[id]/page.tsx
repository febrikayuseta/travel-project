// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

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
      <div className='p-6'>
        <Typography variant='h4'>Activity not found</Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Card className='rounded-3xl overflow-hidden shadow-xl'>
          <div className='relative bs-[400px]'>
            <ServerSafeImage 
              src={activity.imageUrls?.[0] || ''} 
              alt={activity.title} 
              height={400} 
            />
            <div className='absolute bottom-6 left-6'>
              <Chip 
                label={activity.city} 
                className='bg-white/90 backdrop-blur-md font-bold text-primary shadow-lg'
              />
            </div>
          </div>
          <CardContent className='p-8'>
            <Typography variant='h3' fontWeight='900' className='mb-4'>
              {activity.title}
            </Typography>
            <div className='flex items-center gap-4 mb-6'>
              <div className='flex items-center gap-1 text-yellow-500'>
                <i className='ri-star-fill text-xl' />
                <Typography variant='h6' fontWeight='bold' color='textPrimary'>
                  {activity.rating || 0}
                </Typography>
              </div>
              <Typography color='textSecondary'>
                ({activity.total_reviews || 0} Reviews)
              </Typography>
              <Divider orientation='vertical' flexItem />
              <Typography className='flex items-center gap-1' color='textSecondary'>
                <i className='ri-map-pin-line' /> {activity.province}
              </Typography>
            </div>
            
            <Typography variant='h5' fontWeight='bold' className='mb-3'>Description</Typography>
            <Typography variant='body1' color='textSecondary' className='leading-relaxed mb-8'>
              {activity.description}
            </Typography>

            <Divider className='mb-8' />

            <Typography variant='h5' fontWeight='bold' className='mb-4'>Facilities</Typography>
            <div 
              className='bg-actionHover p-6 rounded-2xl mb-8'
              dangerouslySetInnerHTML={{ __html: activity.facilities }} 
            />

            <Typography variant='h5' fontWeight='bold' className='mb-4'>Location</Typography>
            <div 
              className='rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-md'
              dangerouslySetInnerHTML={{ __html: activity.location_maps }} 
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Card className='rounded-3xl shadow-xl sticky top-8'>
          <CardHeader 
            title={<Typography variant='h5' fontWeight='bold'>Booking Details</Typography>} 
            className='bg-actionHover px-8 py-5'
          />
          <Divider />
          <CardContent className='p-8 flex flex-col gap-6'>
            <div>
              <Typography variant='caption' color='textSecondary' className='block mb-1'>PRICE PER PERSON</Typography>
              <div className='flex items-baseline gap-2'>
                <Typography variant='h3' color='primary' fontWeight='900'>
                  {formatRupiah(activity.price)}
                </Typography>
              </div>
            </div>

            <Divider />

            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2 text-success'>
                <i className='ri-checkbox-circle-line' />
                <Typography variant='body2' fontWeight='bold'>Instant Confirmation</Typography>
              </div>
              <div className='flex items-center gap-2 text-info'>
                <i className='ri-calendar-check-line' />
                <Typography variant='body2' fontWeight='bold'>Flexible Booking</Typography>
              </div>
            </div>

            <AddToCartButton activityId={activity.id} />

            <Typography variant='caption' color='textDisabled' className='text-center block mt-2'>
              Prices include all taxes and fees.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ActivityDetailPage
