'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'
import CircularProgress from '@mui/material/CircularProgress'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Type Imports
import type { Banner } from '@/types/project-types'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'

export default function BannersPage() {
  const [data, setData] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/proxy/banners')
        const json = await res.json()
        if (res.ok) {
          setData(parseApiData<Banner[]>(json))
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const filteredData = data.filter(banner => {
    const search = searchTerm.toLowerCase()
    return (
      (banner.name?.toLowerCase().includes(search) ?? false) ||
      (banner.id?.toLowerCase().includes(search) ?? false)
    )
  })

  // Pagination calculation
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4' fontWeight='bold' className='mb-6'>All Featured Banners</Typography>
        <div className='mb-6 max-w-sm'>
          <TextField
            fullWidth
            size='small'
            placeholder='Search banners...'
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
            <Typography variant='h6' color='textSecondary'>No banners found.</Typography>
          </div>
        ) : (
          <>
            <Grid container spacing={6}>
              {paginatedData.map(banner => (
                <Grid item xs={12} sm={6} md={4} key={banner.id}>
                  <Card className='group hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden h-full flex flex-col'>
                    <ServerSafeImage 
                      src={banner.imageUrl} 
                      alt={banner.name} 
                      height={192} // h-48 is 12rem = 192px
                    >
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                    </ServerSafeImage>
                    <CardContent className='p-6 flex flex-col mt-auto'>
                      <Typography variant='h6' fontWeight='bold' className='line-clamp-1 mb-3'>
                        {banner.name}
                      </Typography>
                      <div>
                        <Button
                          component={Link}
                          href={`/banners/${banner.id}`}
                          size='small'
                          className='normal-case'
                          color='info'
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
