// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
  role: string
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu, role }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label='User Access'>
          <MenuItem href='/dashboard' icon={<i className='ri-home-smile-line' />}>
            Explore Activities
          </MenuItem>
          <MenuItem href='/cart' icon={<i className='ri-shopping-cart-2-line' />}>
            My Cart
          </MenuItem>
          <MenuItem href='/transactions' icon={<i className='ri-list-check' />}>
            My Transactions
          </MenuItem>
          <MenuItem href='/account' icon={<i className='ri-user-settings-line' />}>
            Account Settings
          </MenuItem>
        </MenuSection>

        {role === 'admin' && (
          <MenuSection label='Admin Control Panel'>
            <MenuItem href='/admin' icon={<i className='ri-dashboard-line' />}>
              Admin Dashboard
            </MenuItem>
            <MenuItem href='/admin/activities' icon={<i className='ri-map-2-line' />}>
              Activities
            </MenuItem>
            <MenuItem href='/admin/categories' icon={<i className='ri-grid-fill' />}>
              Categories
            </MenuItem>
            <MenuItem href='/admin/promos' icon={<i className='ri-discount-percent-line' />}>
              Promos
            </MenuItem>
            <MenuItem href='/admin/banners' icon={<i className='ri-image-line' />}>
              Banners
            </MenuItem>
            <MenuItem href='/admin/transactions' icon={<i className='ri-bank-card-line' />}>
              User Transactions
            </MenuItem>
            <MenuItem href='/admin/payment-methods' icon={<i className='ri-secure-payment-line' />}>
              Payment Methods
            </MenuItem>
            <MenuItem href='/admin/users' icon={<i className='ri-group-line' />}>
              User Management
            </MenuItem>
          </MenuSection>
        )}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
