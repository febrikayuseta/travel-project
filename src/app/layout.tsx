// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Component Imports
import Providers from '@components/Providers'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'TravelYuk - Book Your Adventure',
  description: 'TravelYuk is your ultimate travel companion for booking wahana and tickets.'
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getSystemMode()

  return (
    <html id='__next' lang='en' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers direction={direction}>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
