'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'
import { toast } from 'react-toastify'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

// Type Imports
import type { User } from '@/types/project-types'
import UserDialog from './UserDialog'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const UserListTable = () => {
  // States
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredData = data.filter(user => {
    const search = searchTerm.toLowerCase()
    return (
      (user.name?.toLowerCase().includes(search) ?? false) ||
      (user.email?.toLowerCase().includes(search) ?? false) ||
      (user.id?.toLowerCase().includes(search) ?? false)
    )
  })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/all-user')
      const json = await res.json()
      if (res.ok) {
        setData(parseApiData<User[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    try {
      // Note: Backend might not have a delete user endpoint readily available for admin, 
      // but if it does, it would be /delete-user/:id
      const res = await fetch(`/api/proxy/delete-user/${userToDelete}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(json.message || 'User account deactivated')
        fetchUsers()
        setDeleteDialogOpen(false)
      } else {
        toast.error(json.message || 'Failed to deactivate user')
      }
    } catch (error) {
      toast.error('Fatal error during account management')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className='rounded-3xl shadow-xl border border-divider overflow-hidden'>
      <CardHeader 
        title={<Typography variant='h5' fontWeight='bold'>User Directory</Typography>}
        action={
          <TextField
            size='small'
            placeholder='Search Users...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line' />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 250 }}
          />
        }
        className='p-6'
      />
      <Divider />
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='!bg-primary/10'>
            <tr>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>User Profile</th>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Contact Info</th>
              <th className='!px-6 !py-5 !text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Role</th>
              <th className='!px-6 !py-5 !text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className='text-center py-20'>
                  <CircularProgress size={40} thickness={4} />
                  <Typography className='mt-4 opacity-60 font-medium'>Accessing Secure Directory...</Typography>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No users match your search
                </td>
              </tr>
            ) : (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                <tr key={user.id} className='hover:bg-actionHover transition-colors border-b border-divider last:border-0'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <Avatar src={user.profilePictureUrl} className='border border-divider shadow-sm'>
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </Avatar>
                      <div className='min-w-0'>
                        <Typography fontWeight='bold' color='textPrimary' className='truncate'>
                          {user.name || 'Incognito User'}
                        </Typography>
                        <Typography variant='caption' className='block opacity-50 truncate max-w-[150px]'>
                          UID: {user.id.substring(0, 8)}...
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2' fontWeight='bold'>
                      {user.email}
                    </Typography>
                    <Typography variant='caption' className='block opacity-50'>
                      {user.phoneNumber || 'No phone set'}
                    </Typography>
                  </td>
                  <td className='p-4 text-center'>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'admin' ? 'primary' : 'secondary'}
                      variant='outlined'
                      size='small'
                      className='font-black uppercase tracking-widest'
                    />
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-1'>
                      <IconButton 
                        size='small' 
                        color='primary' 
                        className='bg-primary/10'
                        onClick={() => handleEdit(user)}
                      >
                        <i className='ri-shield-user-line' />
                      </IconButton>
                      <IconButton 
                        size='small' 
                        color='error' 
                        className='bg-error/10'
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <i className='ri-user-unfollow-line' />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
        className='border-t border-divider'
      />

      <UserDialog 
        open={openDialog}
        setOpen={setOpenDialog}
        data={selectedUser}
        onSuccess={fetchUsers}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle className='pbs-12 pli-12 flex flex-col items-center gap-2'>
          <i className='ri-error-warning-line text-[80px] text-error' />
          <Typography variant='h4' fontWeight='bold'>Revoke Access?</Typography>
        </DialogTitle>
        <DialogContent className='pli-12 pbs-0 text-center'>
          <Typography>
            This will deactivate the user's account. They will no longer be able to log in.
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbe-12 pli-12 gap-3'>
          <Button variant='outlined' color='secondary' onClick={() => setDeleteDialogOpen(false)}>
            Keep User
          </Button>
          <LoadingButton 
            variant='contained' 
            color='error' 
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            Deactivate User
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default UserListTable
