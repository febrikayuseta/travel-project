'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Skeleton from '@mui/material/Skeleton'

// Type Imports
import type { Transaction } from '@/types/project-types'

// Utils Imports
import { formatRupiah, parseApiData } from '@/utils/apiUtils'

const TransactionsPage = () => {
  // States
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/proxy/my-transactions')
        const json = await res.json()
        if (res.ok) {
          setTransactions(parseApiData<Transaction[]>(json))
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'success'
      case 'pending':
        return 'warning'
      case 'failed':
      case 'cancelled':
        return 'error'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-6 p-6'>
        <Skeleton variant='rectangular' height={100} />
        <Skeleton variant='rectangular' height={400} />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <Typography variant='h3' fontWeight='bold' className='mb-2'>
          My Transactions
        </Typography>
        <Typography color='text.secondary'>
          Keep track of your travel bookings and payment history.
        </Typography>
      </div>

      <Card>
        {transactions.length === 0 ? (
          <CardContent className='text-center p-12 flex flex-col items-center gap-4'>
            <Typography variant='h5'>No transactions found</Typography>
            <Typography color='text.secondary'>You haven't made any bookings yet.</Typography>
            <Button variant='contained' component={Link} href='/dashboard'>
              Browse Activities
            </Button>
          </CardContent>
        ) : (
          <TableContainer>
            <Table>
              <TableHead className='bg-actionHover'>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(transaction => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Typography fontWeight='bold' variant='body2'>
                        #{transaction.id.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight='bold' color='primary'>
                        {formatRupiah(transaction.totalAmount || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status.toUpperCase()}
                        color={getStatusColor(transaction.status)}
                        size='small'
                        variant='tonal'
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <Button
                        size='small'
                        component={Link}
                        href={`/transactions/${transaction.id}`}
                        variant='outlined'
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  )
}

export default TransactionsPage
