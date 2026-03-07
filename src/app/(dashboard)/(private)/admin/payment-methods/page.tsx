import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

const paymentMethods = [
  { id: 1, name: 'Bank Transfer', status: 'Enabled', providers: ['BCA', 'Mandiri', 'BNI'] },
  { id: 2, name: 'Credit Card', status: 'Enabled', providers: ['Visa', 'Mastercard'] },
  { id: 3, name: 'Digital Wallet', status: 'Disabled', providers: ['GoPay', 'OVO'] }
]

const AdminPaymentMethodsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <Typography variant='h4'>Payment Methods</Typography>
            <Typography color='textSecondary'>Configure available payment options for users.</Typography>
          </div>
          <Button variant='contained' startIcon={<i className='ri-settings-3-line' />}>Configure API</Button>
        </div>
      </Grid>
      {paymentMethods.map(method => (
        <Grid item xs={12} md={4} key={method.id}>
          <Card className='rounded-3xl h-full flex flex-col'>
            <CardContent className='p-6 flex-grow'>
              <div className='flex items-center justify-between mb-4'>
                <Typography variant='h6' fontWeight='bold'>{method.name}</Typography>
                <div className={`w-3 h-3 rounded-full ${method.status === 'Enabled' ? 'bg-success' : 'bg-error'}`} />
              </div>
              <Typography variant='body2' className='mb-4'>Status: {method.status}</Typography>
              <Divider className='mb-4' />
              <Typography variant='subtitle2' className='mb-2'>Providers:</Typography>
              <div className='flex flex-wrap gap-2'>
                {method.providers.map(p => (
                  <div key={p} className='px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold'>
                    {p}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardContent className='p-6 bg-actionHover'>
              <Button variant='contained' fullWidth size='small' className='rounded-xl'>Manage Method</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default AdminPaymentMethodsPage
