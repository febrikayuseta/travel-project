// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): HorizontalMenuDataType[] => [
  {
    label: dictionary['navigation'].dashboards,
    icon: 'ri-home-smile-line',
    children: [
      {
        label: dictionary['navigation'].analytics,
        icon: 'ri-bar-chart-line',
        href: '/dashboard'
      }
    ]
  },
  {
    label: 'Travel Activities',
    icon: 'ri-map-pin-2-line',
    children: [
      {
        label: 'Activities',
        icon: 'ri-map-pin-line',
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
    label: 'Transactions',
    icon: 'ri-bill-line',
    href: '/transactions'
  },
  {
    label: 'Manage Bookings',
    icon: 'ri-shield-user-line',
    href: '/admin/transactions'
  }
]

export default horizontalMenuData
