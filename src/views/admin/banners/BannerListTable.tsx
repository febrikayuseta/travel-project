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
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { toast } from 'react-toastify'

// Type Imports
import type { Banner } from '@/types/project-types'

// Component Imports
import ServerSafeImage from '@/components/dashboard/ServerSafeImage'
import BannerDialog from './BannerDialog'

// Util Imports
import { parseApiData } from '@/utils/apiUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const BannerListTable = () => {
  // States
  const [data, setData] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Dialog States
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/banners')
      const json = await res.json()
      if (res.ok) {
        setData(parseApiData<Banner[]>(json))
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredData = data.filter(banner => {
    const search = searchTerm.toLowerCase()
    return (
      (banner.name?.toLowerCase().includes(search) ?? false) ||
      (banner.id?.toLowerCase().includes(search) ?? false)
    )
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedBanner(undefined)
    setOpenDialog(true)
  }

  const handleDeleteClick = (id: string) => {
    setBannerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/proxy/delete-banner/${bannerToDelete}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(json.message || 'Banner deleted successfully')
        fetchBanners()
        setDeleteDialogOpen(false)
      } else {
        toast.error(json.message || 'Failed to delete banner')
      }
    } catch (error) {
      toast.error('An error occurred during deletion')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className='rounded-3xl shadow-xl border border-divider overflow-hidden'>
      <CardHeader 
        title={<Typography variant='h5' fontWeight='bold'>Banner Management</Typography>}
        action={
          <div className='flex items-center gap-4 flex-wrap'>
            <TextField
              size='small'
              placeholder='Search Banners...'
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
            <Button 
              variant='contained' 
              startIcon={<i className='ri-add-line' />} 
              className='rounded-xl'
              onClick={handleAdd}
            >
              Add New Banner
            </Button>
          </div>
        }
        className='p-6'
      />
      <Divider />
      
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='!bg-primary/10'>
            <tr>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Banner Preview</th>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Name</th>
              <th className='!px-6 !py-5 !text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Created At</th>
              <th className='!px-6 !py-5 !text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className='text-center py-20'>
                  <CircularProgress size={40} thickness={4} />
                  <Typography className='mt-4 opacity-60 font-medium'>Loading Banners...</Typography>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No Banners match your search
                </td>
              </tr>
            ) : (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(banner => (
                <tr key={banner.id} className='hover:bg-actionHover transition-colors border-b border-divider last:border-0'>
                  <td className='p-4'>
                    <div className='w-24 h-14 rounded-lg overflow-hidden border border-divider shadow-sm'>
                      <ServerSafeImage src={banner.imageUrl} alt={banner.name} className='w-full h-full object-cover' />
                    </div>
                  </td>
                  <td className='p-4'>
                    <Typography fontWeight='bold' color='primary' className='hover:underline cursor-pointer'>
                      {banner.name}
                    </Typography>
                    <Typography variant='caption' color='textSecondary' className='block opacity-60'>
                      UID: {banner.id.substring(0, 8)}...
                    </Typography>
                  </td>
                  <td className='p-4 text-center'>
                    <Typography variant='body2' className='font-mono opacity-80'>
                      {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-1'>
                      <IconButton 
                        size='small' 
                        color='info' 
                        className='bg-info/10'
                        onClick={() => handleEdit(banner)}
                      >
                        <i className='ri-edit-box-line' />
                      </IconButton>
                      <IconButton 
                        size='small' 
                        color='error' 
                        className='bg-error/10'
                        onClick={() => handleDeleteClick(banner.id)}
                      >
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

      <BannerDialog 
        open={openDialog}
        setOpen={setOpenDialog}
        data={selectedBanner}
        onSuccess={fetchBanners}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle className='pbs-12 pli-12 flex flex-col items-center gap-2'>
          <i className='ri-error-warning-line text-[80px] text-warning' />
          <Typography variant='h4' fontWeight='bold'>Are you sure?</Typography>
        </DialogTitle>
        <DialogContent className='pli-12 pbs-0 text-center'>
          <Typography>
            You are about to delete this banner. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className='justify-center pbe-12 pli-12 gap-3'>
          <Button variant='outlined' color='secondary' onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <LoadingButton 
            variant='contained' 
            color='error' 
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            Yes, Delete it
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default BannerListTable
