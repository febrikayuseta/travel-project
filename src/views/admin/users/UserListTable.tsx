'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

// Type Imports
import type { User } from '@/types/project-types'

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

  return (
    <Card className='rounded-3xl shadow-xl border border-divider overflow-hidden'>
      <CardHeader 
        title={<Typography variant='h5' fontWeight='bold'>User Directory</Typography>}
        className='p-6'
      />
      <Divider />
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='bg-primary/5'>
            <tr>
              <th className='px-6 py-5 text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>User Profile</th>
              <th className='px-6 py-5 text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Contact Info</th>
              <th className='px-6 py-5 text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Role</th>
              <th className='px-6 py-5 text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
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
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No users registered
                </td>
              </tr>
            ) : (
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
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
                      variant='tonal'
                      size='small'
                      className='font-black uppercase tracking-widest'
                    />
                  </td>
                  <td className='p-4 text-right'>
                     <IconButton size='small' color='secondary' className='bg-secondary/10'>
                       <i className='ri-more-2-line' />
                     </IconButton>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
        className='border-t border-divider'
      />
    </Card>
  )
}

export default UserListTable
