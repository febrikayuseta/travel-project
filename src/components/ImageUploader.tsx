'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void
  label?: string
}

export default function ImageUploader({ onUploadSuccess, label = 'Drag and drop an image here, or click to select' }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    console.log('file', file)
    setLoading(true)

    try {
      // Prepare FormData
      const formData = new FormData()
      formData.append('image', file)

      // Hit proxy endpoint which forwards to travel-journal-api upload-image
      const res = await fetch('/api/proxy/upload-image', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header manually when using FormData, 
        // fetch will automatically set it with the correct boundary!
      })

      const json = await res.json()

      if (res.ok && json.url) {
        toast.success(json.message || 'Image uploaded successfully')
        onUploadSuccess(json.url)
      } else {
        toast.error(json.message || 'Failed to upload image')
      }
    } catch (error) {
      toast.error('An error occurred during image upload')
    } finally {
      setLoading(false)
    }
  }, [onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'action.hover',
          borderColor: 'primary.main'
        }
      }}
    >
      <input {...getInputProps()} />
      {loading ? (
        <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
          <CircularProgress size={32} />
          <Typography variant='body2' color='textSecondary'>
            Uploading image...
          </Typography>
        </Box>
      ) : (
        <Box display='flex' flexDirection='column' alignItems='center' gap={1}>
          <i className='ri-upload-cloud-2-line text-4xl text-actionActive opacity-50' />
          <Typography variant='body2' color='text.secondary'>
            {label}
          </Typography>
          <Typography variant='caption' color='text.disabled'>
            Supports JPG, PNG, WEBP, GIF
          </Typography>
        </Box>
      )}
    </Box>
  )
}
