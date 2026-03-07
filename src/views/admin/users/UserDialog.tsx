'use client'

import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import { toast } from 'react-toastify'
import type { User, Role } from '@/types/project-types'

type UserDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: User
  onSuccess: () => void
}

const UserDialog = ({ open, setOpen, data, onSuccess }: UserDialogProps) => {
  const [role, setRole] = useState<Role>('user')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data) {
      setRole(data.role)
    }
  }, [data, open])

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setLoading(true)

    try {
      const res = await fetch(`/api/proxy/update-user-role/${data.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json.message || 'User role updated safely')
        onSuccess()
        handleClose()
      } else {
        toast.error(json.message || 'Authorization error or invalid role')
      }
    } catch (error) {
      toast.error('Failed to update system permissions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogTitle className='pbs-12 pli-12 flex flex-col items-center gap-4'>
        <Avatar 
          src={data?.profilePictureUrl} 
          sx={{ width: 80, height: 80 }}
          className='border-4 border-primary/20 shadow-xl'
        >
          {data?.name?.charAt(0) || data?.email.charAt(0)}
        </Avatar>
        <div className='text-center'>
          <Typography variant='h4' fontWeight='bold'>Update Permissions</Typography>
          <Typography variant='body2' className='opacity-60'>{data?.email}</Typography>
        </div>
        <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent className='pli-12 pbs-0 pbe-12'>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='System Role'
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                helperText='Administrators have full access to the database.'
              >
                <MenuItem value='user'>Regular User</MenuItem>
                <MenuItem value='admin'>System Administrator</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions className='justify-center pbe-12 pli-12'>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton 
            variant='contained' 
            type='submit' 
            loading={loading}
            className='min-w-[150px]'
          >
            Apply Changes
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserDialog
