import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import PromoListTable from '@/views/admin/promos/PromoListTable'

const AdminPromosPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Promotions & Campaigns
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Monitor your marketing efforts and adjust discount strategies.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <PromoListTable />
      </Grid>
    </Grid>
  )
}

export default AdminPromosPage
