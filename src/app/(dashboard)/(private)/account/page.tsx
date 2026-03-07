// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import AccountDetails from '@views/pages/account-settings/account/AccountDetails'

const AccountSettingsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AccountDetails />
      </Grid>
    </Grid>
  )
}

export default AccountSettingsPage
