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
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'
import { toast } from 'react-toastify'

// Type Imports
import type { Promo } from '@/types/project-types'
import PromoDialog from './PromoDialog'

// Util Imports
import { parseApiData, formatRupiah } from '@/utils/apiUtils'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const PromoListTable = () => {
  // States
  const [data, setData] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState<Promo | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredData = data.filter(promo => {
    const search = searchTerm.toLowerCase()
    return (
      (promo.title?.toLowerCase().includes(search) ?? false) ||
      (promo.promo_code?.toLowerCase().includes(search) ?? false) ||
      (promo.id?.toLowerCase().includes(search) ?? false)
    )
  })

  const fetchPromos = async () => {
    setLoading(true)
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

  useEffect(() => {
    fetchPromos()
  }, [])

  const handleEdit = (promo: Promo) => {
    setSelectedPromo(promo)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedPromo(undefined)
    setOpenDialog(true)
  }

  const handleDeleteClick = (id: string) => {
    setPromoToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!promoToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/proxy/delete-promo/${promoToDelete}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(json.message || 'Promo deleted successfully')
        fetchPromos()
        setDeleteDialogOpen(false)
      } else {
        toast.error(json.message || 'Failed to delete promo')
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
        title={<Typography variant='h5' fontWeight='bold'>Promotions & Offers</Typography>}
        action={
          <div className='flex items-center gap-4 flex-wrap'>
            <TextField
              size='small'
              placeholder='Search Promos...'
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
              Create Promo
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
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Offer Info</th>
              <th className='!px-6 !py-5 !text-left font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Promo Code</th>
              <th className='!px-6 !py-5 !text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Discount</th>
              <th className='!px-6 !py-5 !text-center font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Min. Spend</th>
              <th className='!px-6 !py-5 !text-right font-bold uppercase tracking-widest text-[11px] text-primary whitespace-nowrap border-b border-divider'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='text-center py-20'>
                  <CircularProgress size={40} thickness={4} />
                  <Typography className='mt-4 opacity-60 font-medium'>Fetching Offers...</Typography>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className='text-center py-20 opacity-40 font-bold text-lg italic'>
                  No Active Promos matching your search
                </td>
              </tr>
            ) : (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(promo => (
                <tr key={promo.id} className='hover:bg-actionHover transition-colors border-b border-divider last:border-0'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-lg overflow-hidden border border-divider shadow-sm shrink-0'>
                        <img src={promo.imageUrl} alt={promo.title} className='w-full h-full object-cover' />
                      </div>
                      <div className='min-w-0'>
                        <Typography fontWeight='bold' className='truncate' color='textPrimary'>
                          {promo.title}
                        </Typography>
                        <Typography variant='caption' className='block truncate opacity-60 max-w-[200px]'>
                          {promo.description}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className='p-4'>
                    <Chip 
                      label={promo.promo_code} 
                      className='font-black tracking-[1px] bg-primary/10 text-primary border border-primary/20 rounded-lg' 
                    />
                  </td>
                  <td className='p-4 text-center'>
                    <Typography fontWeight='900' color='success.main'>
                      {formatRupiah(promo.promo_discount_price)}
                    </Typography>
                  </td>
                  <td className='p-4 text-center text-textSecondary opacity-80'>
                    {formatRupiah(promo.minimum_claim_price)}
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-1'>
                      <IconButton 
                        size='small' 
                        color='primary' 
                        className='bg-primary/10'
                        onClick={() => handleEdit(promo)}
                      >
                        <i className='ri-edit-box-line' />
                      </IconButton>
                      <IconButton 
                        size='small' 
                        color='error' 
                        className='bg-error/10'
                        onClick={() => handleDeleteClick(promo.id)}
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

      <PromoDialog 
        open={openDialog}
        setOpen={setOpenDialog}
        data={selectedPromo}
        onSuccess={fetchPromos}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle className='pbs-12 pli-12 flex flex-col items-center gap-2'>
          <i className='ri-error-warning-line text-[80px] text-warning' />
          <Typography variant='h4' fontWeight='bold'>Delete Promotion?</Typography>
        </DialogTitle>
        <DialogContent className='pli-12 pbs-0 text-center'>
          <Typography>
            This will deactivate the promo code and remove it from the system.
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

export default PromoListTable
