// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  {
    label: dictionary['navigation'].dashboards,
    icon: 'ri-home-smile-line',
    href: '/dashboard'
  },
  {
    label: 'Explore',
    isSection: true,
    children: [
      {
        label: 'Activities',
        icon: 'ri-map-pin-2-line',
        href: '/activities'
      },
      {
        label: 'Promotions',
        icon: 'ri-percent-line',
        href: '/promos'
      },
      {
        label: 'Banners',
        icon: 'ri-image-line',
        href: '/banners'
      },
      {
        label: 'My Cart',
        icon: 'ri-shopping-cart-2-line',
        href: '/cart'
      },
      {
        label: 'My Transactions',
        icon: 'ri-bill-line',
        href: '/transactions'
      }
    ]
  },
  {
    label: 'Administration',
    isSection: true,
    children: [
      {
        label: 'Admin Dashboard',
        icon: 'ri-dashboard-line',
        href: '/admin'
      },
      {
        label: 'Manage Activities',
        icon: 'ri-map-pin-line',
        href: '/admin/activities'
      },
      {
        label: 'Manage Categories',
        icon: 'ri-list-check',
        href: '/admin/categories'
      },
      {
        label: 'Manage Promos',
        icon: 'ri-percent-line',
        href: '/admin/promos'
      },
      {
        label: 'Manage Banners',
        icon: 'ri-image-line',
        href: '/admin/banners'
      },
      {
        label: 'Manage Bookings',
        icon: 'ri-shield-user-line',
        href: '/admin/transactions'
      },
      {
        label: 'Payment Methods',
        icon: 'ri-bank-card-line',
        href: '/admin/payment-methods'
      },
      {
        label: 'User Management',
        icon: 'ri-group-line',
        href: '/admin/users'
      }
    ]
  }
]

export default verticalMenuData
