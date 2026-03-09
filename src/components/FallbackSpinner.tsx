'use client'

// MUI Imports
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div className='flex items-center gap-2 mb-6'>
        <i className='ri-flight-takeoff-line text-primary text-[3rem]' />
        <span className='text-primary text-[2rem] font-semibold tracking-wide'>TravelYuk</span>
      </div>
      <CircularProgress disableShrink />
    </Box>
  )
}

export default FallbackSpinner
