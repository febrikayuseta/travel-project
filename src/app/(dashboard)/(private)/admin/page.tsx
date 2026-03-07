// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'

const adminLinks = [
  { href: '/admin/activities', label: 'Activities', icon: 'ri-map-2-line' },
  { href: '/admin/categories', label: 'Categories', icon: 'ri-grid-fill' },
  { href: '/admin/promos', label: 'Promos', icon: 'ri-discount-percent-line' },
  { href: '/admin/banners', label: 'Banners', icon: 'ri-image-line' },
  { href: '/admin/transactions', label: 'User Transactions', icon: 'ri-bank-card-line' },
  { href: '/admin/payment-methods', label: 'Payment Methods', icon: 'ri-secure-payment-line' },
  { href: '/admin/users', label: 'User Management', icon: 'ri-group-line' }
]

const AdminDashboard = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex flex-col gap-2'>
          <Typography variant='h3' fontWeight='bold'>Admin Control Panel</Typography>
          <Typography color='textSecondary'>Manage your travel platform content and users.</Typography>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {adminLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card className='hover:shadow-lg transition-all duration-300 rounded-3xl group'>
                <CardContent className='flex flex-col items-center gap-4 py-8'>
                  <div className='w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors'>
                    <i className={`${link.icon} text-3xl text-primary group-hover:text-white transition-colors`} />
                  </div>
                  <Typography variant='h6' fontWeight='bold' textAlign='center'>{link.label}</Typography>
                  <Button
                    component={Link}
                    href={link.href}
                    variant='outlined'
                    size='small'
                    className='rounded-xl mt-2'
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AdminDashboard
