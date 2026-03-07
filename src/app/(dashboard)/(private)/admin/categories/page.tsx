import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import CategoryListTable from '@/views/admin/categories/CategoryListTable'

const AdminCategoriesPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Global Taxonomy
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Organize and classify your travel offerings into distinct discovery channels.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <CategoryListTable />
      </Grid>
    </Grid>
  )
}

export default AdminCategoriesPage
