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
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'

// Type Imports
import type { Activity } from '@/types/project-types'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

export default function ActivitiesPage() {
  const [data, setData] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    const fetchActivities = async () => {
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
    fetchActivities()
  }, [])

  const sortedAndFilteredData = data
    .filter(activity => {
      const search = searchTerm.toLowerCase()
      return (
        (activity.title?.toLowerCase().includes(search) ?? false) ||
        (activity.city?.toLowerCase().includes(search) ?? false) ||
        (activity.province?.toLowerCase().includes(search) ?? false)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = a.price_discount > 0 ? a.price - a.price_discount : a.price
        const priceB = b.price_discount > 0 ? b.price - b.price_discount : b.price
        return priceA - priceB
      }
      if (sortBy === 'price-high') {
        const priceA = a.price_discount > 0 ? a.price - a.price_discount : a.price
        const priceB = b.price_discount > 0 ? b.price - b.price_discount : b.price
        return priceB - priceA
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      }
      return 0
    })

  // Pagination calculation
  const paginatedData = sortedAndFilteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4' fontWeight='bold' className='mb-6'>All Activities</Typography>
        <div className='mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between'>
          <div className='w-full max-w-sm'>
            <TextField
              fullWidth
              size='small'
              placeholder='Search destinations or activities...'
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

          <FormControl size='small' className='min-w-[200px] w-full sm:w-auto'>
            <InputLabel id='sort-by-label'>Sort By</InputLabel>
            <Select
              labelId='sort-by-label'
              value={sortBy}
              label='Sort By'
              onChange={e => {
                setSortBy(e.target.value)
                setPage(0)
              }}
            >
              <MenuItem value='default'>Default</MenuItem>
              <MenuItem value='price-low'>Price: Low to High</MenuItem>
              <MenuItem value='price-high'>Price: High to Low</MenuItem>
              <MenuItem value='rating'>Top Rated</MenuItem>
            </Select>
          </FormControl>
        </div>

        {loading ? (
          <div className='flex justify-center py-20'>
            <CircularProgress />
          </div>
        ) : sortedAndFilteredData.length === 0 ? (
          <div className='text-center py-20'>
            <Typography variant='h6' color='textSecondary'>No activities found.</Typography>
          </div>
        ) : (
          <>
            <Grid container spacing={6}>
              {paginatedData.map(activity => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <Card className='group hover:shadow-2xl transition-all rounded-3xl overflow-hidden h-full flex flex-col'>
                    {activity.imageUrls && activity.imageUrls.length > 0 && (
                      <ServerSafeImage 
                        src={activity.imageUrls[0]} 
                        alt={activity.title} 
                        city={activity.city}
                        height={224}
                      />
                    )}
                    <CardContent className='p-6 flex-grow flex flex-col'>
                      <Typography variant='h6' fontWeight='bold' className='line-clamp-1 mb-1'>
                        {activity.title}
                      </Typography>
                      <div className='flex items-center gap-1 mb-4'>
                        <i className='ri-star-fill text-yellow-500' />
                        <Typography variant='body2' fontWeight='bold'>{activity.rating || 0}</Typography>
                        <Typography variant='caption' color='textSecondary'>({activity.total_reviews || 0} reviews)</Typography>
                      </div>
                      <div className='mt-auto flex items-center justify-between pt-4 border-t border-divider'>
                        <div>
                          <Typography variant='caption' color='textSecondary' className='block'>Starting from</Typography>
                          {activity.price_discount > 0 ? (
                            <>
                              <Typography variant='caption' className='line-through text-textDisabled'>
                                {formatRupiah(activity.price)}
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='900'>
                                {formatRupiah(activity.price - activity.price_discount)}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant='h6' color='primary' fontWeight='900'>
                              {formatRupiah(activity.price)}
                            </Typography>
                          )}
                        </div>
                        <Button
                          component={Link}
                          href={`/activities/${activity.id}`}
                          variant='outlined'
                          className='rounded-xl'
                        >
                          Details
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
                count={sortedAndFilteredData.length}
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
