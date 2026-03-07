import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

const banners = [
  { id: 1, name: 'Summer Escape', imageUrl: '/images/apps/ecommerce/banner-1.png', status: 'Active' },
  { id: 2, name: 'Winter Holidays', imageUrl: '/images/apps/ecommerce/banner-2.png', status: 'Inactive' }
]

const AdminBannersPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <Typography variant='h4'>Manage Banners</Typography>
            <Typography color='textSecondary'>Update homepage banners and featured content.</Typography>
          </div>
          <Button variant='contained' startIcon={<i className='ri-add-line' />}>Add Banner</Button>
        </div>
      </Grid>
      {banners.map(banner => (
        <Grid item xs={12} sm={6} md={4} key={banner.id}>
          <Card className='rounded-3xl overflow-hidden'>
            <div className='relative h-48'>
              <img src={banner.imageUrl} alt={banner.name} className='w-full h-full object-cover' />
            </div>
            <CardContent className='p-6'>
              <Typography variant='h6' fontWeight='bold'>{banner.name}</Typography>
              <Typography variant='body2' color='textSecondary' className='mb-4'>{banner.status}</Typography>
              <div className='flex gap-2'>
                <Button variant='outlined' size='small' fullWidth>Edit</Button>
                <Button variant='outlined' color='error' size='small' fullWidth>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default AdminBannersPage
