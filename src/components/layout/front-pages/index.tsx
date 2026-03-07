// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages/Footer'
import Header from '@components/layout/front-pages/Header'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Next Imports
import { cookies } from 'next/headers'

const FrontLayout = ({ children }: ChildrenType) => {
  // Vars
  const mode = getServerMode()
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  
  let role = 'user'
  let isLoggedIn = !!token

  if (token) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      role = payload.role || 'user'
    } catch (e) {
      // Token might be malformed or not a JWT
    }
  }

  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} isLoggedIn={isLoggedIn} role={role} />
      {children}
      <Footer />
    </div>
  )
}

export default FrontLayout
