import ProductCategoryTable from '@views/apps/ecommerce/products/category/ProductCategoryTable'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const AdminCategoriesPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Manage Categories</Typography>
        <Typography color='textSecondary'>Organize activities into categories for better discovery.</Typography>
      </Grid>
      <Grid item xs={12}>
        <ProductCategoryTable />
      </Grid>
    </Grid>
  )
}

export default AdminCategoriesPage
