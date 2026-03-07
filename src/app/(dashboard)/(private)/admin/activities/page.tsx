import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import ActivityListTable from '@/views/admin/activities/ActivityListTable'

const AdminActivitiesPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Content Management
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Control your global inventory of travel experiences and adventure packages.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <ActivityListTable />
      </Grid>
    </Grid>
  )
}

export default AdminActivitiesPage
