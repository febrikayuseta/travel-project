'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Link from 'next/link'
import CircularProgress from '@mui/material/CircularProgress'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { Promo } from '@/types/project-types'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

export default function PromosPage() {
  const [data, setData] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch('/api/proxy/promos')
        const json = await res.json()
        if (res.ok) {
          setData(parseApiData<Promo[]>(json))
        }
      } catch (error) {
        console.error('Failed to fetch promos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPromos()
  }, [])

  const filteredData = data.filter(promo => {
    const search = searchTerm.toLowerCase()
    return (
      (promo.title?.toLowerCase().includes(search) ?? false) ||
      (promo.description?.toLowerCase().includes(search) ?? false) ||
      (promo.promo_code?.toLowerCase().includes(search) ?? false)
    )
  })

  // Pagination calculation
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4' fontWeight='bold' className='mb-6'>All Promos</Typography>
        <div className='mb-6 max-w-sm'>
          <TextField
            fullWidth
            size='small'
            placeholder='Search promos...'
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setPage(0)
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line' />
                </InputAdornment>
              )
            }}
          />
        </div>

        {loading ? (
          <div className='flex justify-center py-20'>
            <CircularProgress />
          </div>
        ) : filteredData.length === 0 ? (
          <div className='text-center py-20'>
            <Typography variant='h6' color='textSecondary'>No promos found.</Typography>
          </div>
        ) : (
          <>
            <Grid container spacing={6}>
              {paginatedData.map(promo => (
                <Grid item xs={12} sm={6} md={4} key={promo.id}>
                  <Card className='hover:shadow-xl transition-shadow rounded-3xl border border-primary/5 h-full'>
                    <CardContent className='p-6 flex flex-col h-full'>
                      <div className='mb-4 flex flex-wrap gap-2 items-center'>
                        <Chip
                          label={`Save ${formatRupiah(promo.promo_discount_price)}`}
                          color='primary'
                          size='small'
                          className='font-bold'
                        />
                        <Chip
                          label={promo.promo_code}
                          variant='outlined'
                          color='secondary'
                          size='small'
                          className='font-mono font-bold uppercase tracking-widest'
                        />
                      </div>
                      <Typography variant='h5' fontWeight='800' className='line-clamp-2 mb-3 leading-tight'>
                        {promo.title}
                      </Typography>
                      <Typography variant='body2' className='text-textSecondary mb-4'>
                        Min. spend {formatRupiah(promo.minimum_claim_price)}
                      </Typography>
                      <div className='mt-auto flex justify-between items-center'>
                        <Button
                          component={Link}
                          href={`/promos/${promo.id}`}
                          variant='contained'
                          fullWidth
                          className='rounded-xl py-2'
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div className='mt-8 flex justify-end'>
              <TablePagination
                component='div'
                count={filteredData.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10))
                  setPage(0)
                }}
                rowsPerPageOptions={[6, 12, 24]}
              />
            </div>
          </>
        )}
      </Grid>
    </Grid>
  )
}
