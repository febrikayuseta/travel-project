// Third-party Imports
import { cookies } from 'next/headers'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children }: ChildrenType) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  return <>{token ? children : <AuthRedirect />}</>
}
