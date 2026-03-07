'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Rating from '@mui/material/Rating'

// Type Imports
import type { Activity } from '@/types/project-types'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const ActivityListTable = () => {
  // States
  const [data, setData] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/activities')
      const json = await res.json()
      if (res.ok) {
        setData(parseApiData<Activity[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  return (
    <Card className='rounded-3xl shadow-xl border border-divider overflow-hidden'>
      <CardHeader 
        title={<Typography variant='h5' fontWeight='bold'>Travel Activities</Typography>}
        action={
          <Button variant='contained' startIcon={<i className='ri-add-line' />} className='rounded-xl'>
            Create Activity
          </Button>
        }
        className='p-6'
      />
      <Divider />
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='bg-primary/5'>
            <tr>
              <th className='px-6 py-5 text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Activity Details</th>
              <th className='px-6 py-5 text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Location</th>
              <th className='px-6 py-5 text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Price Info</th>
              <th className='px-6 py-5 text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Rating</th>
              <th className='px-6 py-5 text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='text-center py-20'>
                  <CircularProgress size={40} thickness={4} />
                  <Typography className='mt-4 opacity-60 font-medium'>Syncing Content...</Typography>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No activities available
                </td>
              </tr>
            ) : (
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(activity => (
                <tr key={activity.id} className='hover:bg-actionHover transition-colors border-b border-divider last:border-0'>
                  <td className='p-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-divider shrink-0'>
                        <ServerSafeImage src={activity.imageUrls?.[0]} alt={activity.title} className='w-full h-full object-cover' />
                      </div>
                      <div className='min-w-0'>
                        <Typography fontWeight='bold' className='truncate leading-tight' color='textPrimary'>
                          {activity.title}
                        </Typography>
                        <Typography variant='caption' className='block opacity-60 italic'>
                           UID: {activity.id.substring(0, 8)}...
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2' fontWeight='600' className='flex items-center gap-1 mb-1'>
                      <i className='ri-map-pin-line text-primary' /> {activity.city}
                    </Typography>
                    <Typography variant='caption' className='block opacity-60'>
                      {activity.province}
                    </Typography>
                  </td>
                  <td className='p-4 text-center'>
                    <div className='flex flex-col'>
                      <Typography fontWeight='900' color='primary'>
                        {formatRupiah(activity.price_discount || activity.price)}
                      </Typography>
                      {activity.price_discount > 0 && (
                        <Typography variant='caption' className='line-through opacity-40 italic'>
                          {formatRupiah(activity.price)}
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className='p-4 text-center'>
                    <div className='flex flex-col items-center gap-1'>
                      <Rating value={activity.rating} precision={0.1} size='small' readOnly />
                      <Typography variant='caption' className='opacity-60 font-bold'>
                        ({activity.total_reviews} reviews)
                      </Typography>
                    </div>
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-1'>
                      <IconButton size='small' color='primary' className='bg-primary/10'>
                        <i className='ri-edit-box-line' />
                      </IconButton>
                      <IconButton size='small' color='error' className='bg-error/10'>
                        <i className='ri-delete-bin-line' />
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

export default ActivityListTable
