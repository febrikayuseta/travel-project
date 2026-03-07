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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { Transaction } from '@/types/project-types'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const statusObj: Record<string, { color: 'warning' | 'success' | 'error' | 'secondary', label: string }> = {
  pending: { color: 'warning', label: 'Pending' },
  success: { color: 'success', label: 'Completed' },
  failed: { color: 'error', label: 'Failed' },
  cancelled: { color: 'secondary', label: 'Cancelled' }
}

const TransactionListTable = () => {
  // States
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/all-transactions')
      const json = await res.json()
      if (res.ok) {
        setData(parseApiData<Transaction[]>(json))
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredData = data.filter(tx => {
    const search = searchTerm.toLowerCase()
    return (
      (tx.invoiceId?.toLowerCase().includes(search) ?? false) ||
      (tx.id?.toLowerCase().includes(search) ?? false) ||
      (tx.status?.toLowerCase().includes(search) ?? false) ||
      tx.totalAmount?.toString().includes(search)
    )
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <Card className='rounded-3xl shadow-xl border border-divider overflow-hidden'>
      <CardHeader 
        title={<Typography variant='h5' fontWeight='bold'>Global Transaction Log</Typography>}
        action={
          <TextField
            size='small'
            placeholder='Search Transactions...'
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
        className='p-6 flex-col sm:flex-row items-start sm:items-center gap-4'
      />
      <Divider />
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='!bg-primary/10'>
            <tr>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Order ID</th>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Date</th>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Amount</th>
              <th className='!px-6 !py-5 !text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Status</th>
              <th className='!px-6 !py-5 !text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='text-center py-20'>
                  <CircularProgress size={40} thickness={4} />
                  <Typography className='mt-4 opacity-60 font-medium'>Syncing Transactions...</Typography>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No transactions matches your search
                </td>
              </tr>
            ) : (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(tx => (
                <tr key={tx.id} className='hover:bg-actionHover transition-colors border-b border-divider last:border-0'>
                  <td className='p-4'>
                    <Typography variant='body2' fontWeight='bold' color='primary'>
                      {tx.invoiceId || `#${tx.id.split('-')[0].toUpperCase()}`}
                    </Typography>
                    <Typography variant='caption' className='block opacity-50'>
                      Items: {tx.transaction_items?.length || tx.carts?.length || 0}
                    </Typography>
                  </td>
                  <td className='p-4'>
                    <Typography variant='body2'>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant='caption' className='block opacity-50'>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Typography>
                  </td>
                  <td className='p-4'>
                    <Typography fontWeight='bold' className='text-lg'>
                      {formatRupiah(tx.totalAmount || 0)}
                    </Typography>
                  </td>
                  <td className='p-4 text-center'>
                    <Chip 
                      label={statusObj[tx.status]?.label || tx.status} 
                      color={statusObj[tx.status]?.color || 'default'}
                      variant='tonal'
                      size='small'
                      className='font-bold uppercase tracking-tighter'
                    />
                  </td>
                  <td className='p-4 text-right'>
                     <IconButton size='small' color='secondary' className='bg-secondary/10'>
                       <i className='ri-eye-line' />
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
    </Card>
  )
}

export default TransactionListTable
