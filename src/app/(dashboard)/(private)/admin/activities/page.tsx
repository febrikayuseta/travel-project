import ProductListTable from '@views/apps/ecommerce/products/list/ProductListTable'
import { getEcommerceData } from '@/app/server/actions'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const AdminActivitiesPage = async () => {
  const data = await getEcommerceData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Manage Activities</Typography>
        <Typography color='textSecondary'>Create, edit, and manage all travel activities.</Typography>
      </Grid>
      <Grid item xs={12}>
        <ProductListTable productData={data?.products} />
      </Grid>
    </Grid>
  )
}

export default AdminActivitiesPage
