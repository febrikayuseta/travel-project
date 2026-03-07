import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import UserListTable from '@/views/admin/users/UserListTable'

const AdminUsersPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Registered Customers
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Control access, monitor engagement, and manage profiles for all platform members.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <UserListTable />
      </Grid>
    </Grid>
  )
}

export default AdminUsersPage
