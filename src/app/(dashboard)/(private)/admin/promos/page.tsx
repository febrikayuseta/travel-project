import InvoiceListTable from '@views/apps/invoice/list/InvoiceListTable'
import { getInvoiceData } from '@/app/server/actions'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const AdminPromosPage = async () => {
  const data = await getInvoiceData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Manage Promos</Typography>
        <Typography color='textSecondary'>Configure and track promotional offers.</Typography>
      </Grid>
      <Grid item xs={12}>
        <InvoiceListTable invoiceData={data} />
      </Grid>
    </Grid>
  )
}

export default AdminPromosPage
