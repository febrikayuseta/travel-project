// MUI Imports
import Button from '@mui/material/Button'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'TravelYuk - Explore the World',
  description: 'Find the best wahana and tour tickets with TravelYuk.'
}

const Layout = ({ children }: ChildrenType) => {
  // Vars
  const systemMode = getSystemMode()

  return (
    <BlankLayout systemMode={systemMode}>
      <IntersectionProvider>
        <FrontLayout>
          {children}
          <ScrollToTop className='mui-fixed'>
            <Button
              variant='contained'
              className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
              <i className='ri-arrow-up-line' />
            </Button>
          </ScrollToTop>
        </FrontLayout>
      </IntersectionProvider>
    </BlankLayout>
  )
}

export default Layout
