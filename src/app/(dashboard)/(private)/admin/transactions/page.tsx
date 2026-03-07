import OrderListTable from '@views/apps/ecommerce/orders/list/OrderListTable'
import { getEcommerceData } from '@/app/server/actions'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const AdminTransactionsPage = async () => {
  const data = await getEcommerceData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>User Transactions</Typography>
        <Typography color='textSecondary'>Monitor and manage all bookings and payments.</Typography>
      </Grid>
      <Grid item xs={12}>
        <OrderListTable orderData={data?.orders} />
      </Grid>
    </Grid>
  )
}

export default AdminTransactionsPage
