'use client'

import { useState } from 'react'
import Chip from '@mui/material/Chip'

interface ServerSafeImageProps {
  src: string
  alt: string
  city?: string
  height?: string | number
  className?: string
  children?: React.ReactNode
}

const ServerSafeImage = ({ src, alt, city, height = 224, className = '', children }: ServerSafeImageProps) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) return null

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`} style={{ height: hasError ? 0 : height }}>
      <img
        src={src}
        alt={alt}
        className='w-full h-full object-cover transition-transform duration-700 hover:scale-110'
        onError={() => setHasError(true)}
      />
      {city && (
        <div className='absolute top-4 left-4'>
          <Chip 
            label={city} 
            size='small' 
            className='bg-slate-900/60 text-white backdrop-blur-md font-bold border-none shadow-sm' 
          />
        </div>
      )}
      {children}
    </div>
  )
}

export default ServerSafeImage
