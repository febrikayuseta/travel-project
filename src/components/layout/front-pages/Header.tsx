'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import Typography from '@mui/material/Typography'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import FrontMenu from './FrontMenu'
import CustomIconButton from '@core/components/mui/IconButton'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'

const Header = ({ mode }: { mode: Mode }) => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            <div className='flex items-center gap-2 sm:gap-4'>
              <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                <i className='ri-menu-line' />
              </IconButton>
              <Link href='/front-pages/landing-page' className='flex items-center gap-2'>
                <i className='ri-flight-takeoff-line text-primary text-2xl sm:text-3xl' />
                <Typography variant='h5' className='font-bold uppercase tracking-widest text-primary'>TravelYuk</Typography>
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            </div>
          ) : (
            <div className='flex items-center gap-10'>
              <Link href='/front-pages/landing-page' className='flex items-center gap-2'>
                <i className='ri-flight-takeoff-line text-primary text-3xl' />
                <Typography variant='h5' className='font-bold uppercase tracking-widest text-primary'>TravelYuk</Typography>
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            </div>
          )}
          <div className='flex items-center gap-2 sm:gap-4'>
            <ModeDropdown />
            {isBelowLgScreen ? (
              <CustomIconButton
                component={Link}
                variant='contained'
                href='/login'
                color='primary'
              >
                <i className='ri-login-circle-line text-xl' />
              </CustomIconButton>
            ) : (
              <>
                <Button
                  component={Link}
                  variant='outlined'
                  href='/register'
                  className='whitespace-nowrap'
                >
                  Register
                </Button>
                <Button
                  component={Link}
                  variant='contained'
                  href='/login'
                  startIcon={<i className='ri-login-circle-line text-xl' />}
                  className='whitespace-nowrap'
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
