import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import PaymentMethodList from '@/views/admin/payment-methods/PaymentMethodList'

const AdminPaymentMethodsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='mb-6'>
          <Typography variant='h3' fontWeight='bold' className='mb-2'>
            Financial Gateways
          </Typography>
          <Typography color='textSecondary' className='text-lg'>
            Configure and maintain the visual representation of your platform's checkout options.
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <PaymentMethodList />
      </Grid>
    </Grid>
  )
}

export default AdminPaymentMethodsPage
