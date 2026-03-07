import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import TransactionListTable from '@/views/admin/transactions/TransactionListTable'

const AdminTransactionsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Global Bookings
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Overview of all customer transactions, booking statuses, and total platform revenue.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <TransactionListTable />
      </Grid>
    </Grid>
  )
}

export default AdminTransactionsPage
