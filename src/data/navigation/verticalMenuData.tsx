// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  {
    label: dictionary['navigation'].dashboards,
    icon: 'ri-home-smile-line',
    children: [
      {
        label: dictionary['navigation'].analytics,
        href: '/dashboard'
      }
    ]
  },
  {
    label: 'Travel Activities',
    isSection: true,
    children: [
      {
        label: 'Activities',
        icon: 'ri-map-pin-2-line',
        href: '/activities'
      },
      {
        label: 'Categories',
        icon: 'ri-list-check',
        href: '/categories'
      },
      {
        label: 'Banners',
        icon: 'ri-image-line',
        href: '/banners'
      },
      {
        label: 'Promos',
        icon: 'ri-percent-line',
        href: '/promos'
      }
    ]
  },
  {
    label: 'User Management',
    isSection: true,
    children: [
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
        label: 'Manage Bookings',
        icon: 'ri-shield-user-line',
        href: '/admin/transactions'
      }
    ]
  }
]

export default verticalMenuData
