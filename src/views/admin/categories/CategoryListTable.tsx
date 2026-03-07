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

// Type Imports
import type { Category } from '@/types/project-types'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const CategoryListTable = () => {
  // States
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/categories')
      const json = await res.json()
      if (res.ok) {
        setData(parseApiData<Category[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <Card className='rounded-3xl shadow-xl border border-divider overflow-hidden'>
      <CardHeader 
        title={<Typography variant='h5' fontWeight='bold'>Category Registry</Typography>}
        action={
          <Button variant='contained' startIcon={<i className='ri-add-line' />} className='rounded-xl'>
            New Category
          </Button>
        }
        className='p-6'
      />
      <Divider />
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='bg-primary/5'>
            <tr>
              <th className='px-6 py-5 text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Visual</th>
              <th className='px-6 py-5 text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Category Name</th>
              <th className='px-6 py-5 text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Last Updated</th>
              <th className='px-6 py-5 text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className='text-center py-20'>
                  <CircularProgress size={40} thickness={4} />
                  <Typography className='mt-4 opacity-60 font-medium'>Loading Categories...</Typography>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No categories defined
                </td>
              </tr>
            ) : (
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
                <tr key={category.id} className='hover:bg-actionHover transition-colors border-b border-divider last:border-0'>
                  <td className='p-4'>
                    <div className='w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-divider'>
                      <ServerSafeImage src={category.imageUrl} alt={category.name} className='w-full h-full object-cover' />
                    </div>
                  </td>
                  <td className='p-4'>
                    <Typography fontWeight='bold' color='textPrimary' className='text-lg'>
                      {category.name}
                    </Typography>
                    <Typography variant='caption' color='textSecondary' className='opacity-60'>
                       ID: {category.id.substring(0, 8)}...
                    </Typography>
                  </td>
                  <td className='p-4 text-center text-textSecondary'>
                    {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}
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
        rowsPerPageOptions={[5, 10, 25]}
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

export default CategoryListTable
