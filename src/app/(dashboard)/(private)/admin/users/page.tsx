import UserListTable from '@views/apps/user/list/UserListTable'
import { getUserData } from '@/app/server/actions'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const AdminUsersPage = async () => {
  const data = await getUserData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>User Management</Typography>
        <Typography color='textSecondary'>Manage user roles, accounts, and permissions.</Typography>
      </Grid>
      <Grid item xs={12}>
        <UserListTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default AdminUsersPage
