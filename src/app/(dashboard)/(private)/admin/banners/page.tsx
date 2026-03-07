import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import BannerListTable from '@/views/admin/banners/BannerListTable'

const AdminBannersPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Banners Dashboard
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Monitor and manage your promotional visuals across the platform.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <BannerListTable />
      </Grid>
    </Grid>
  )
}

export default AdminBannersPage
