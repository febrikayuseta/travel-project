type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'ri-home-smile-line',
    section: 'User Access'
  },
  {
    id: '2',
    name: 'Explore Activities',
    url: '/activities',
    icon: 'ri-map-pin-user-line',
    section: 'User Access'
  },
  {
    id: '3',
    name: 'All Promos',
    url: '/promos',
    icon: 'ri-discount-percent-line',
    section: 'User Access'
  },
  {
    id: '4',
    name: 'All Banners',
    url: '/banners',
    icon: 'ri-image-line',
    section: 'User Access'
  },
  {
    id: '5',
    name: 'My Cart',
    url: '/cart',
    icon: 'ri-shopping-cart-2-line',
    section: 'User Access'
  },
  {
    id: '6',
    name: 'My Transactions',
    url: '/transactions',
    icon: 'ri-list-check',
    section: 'User Access'
  },
  {
    id: '7',
    name: 'Account Settings',
    url: '/account',
    icon: 'ri-user-settings-line',
    section: 'User Access'
  },
  {
    id: '8',
    name: 'Admin Dashboard',
    url: '/admin',
    icon: 'ri-dashboard-line',
    section: 'Admin Management'
  },
  {
    id: '9',
    name: 'Manage Activities',
    url: '/admin/activities',
    icon: 'ri-map-2-line',
    section: 'Admin Management'
  },
  {
    id: '10',
    name: 'Manage Categories',
    url: '/admin/categories',
    icon: 'ri-grid-fill',
    section: 'Admin Management'
  },
  {
    id: '11',
    name: 'Manage Promos',
    url: '/admin/promos',
    icon: 'ri-discount-percent-line',
    section: 'Admin Management'
  },
  {
    id: '12',
    name: 'Manage Banners',
    url: '/admin/banners',
    icon: 'ri-image-line',
    section: 'Admin Management'
  },
  {
    id: '13',
    name: 'Manage User Transactions',
    url: '/admin/transactions',
    icon: 'ri-bank-card-line',
    section: 'Admin Management'
  },
  {
    id: '14',
    name: 'Manage Payment Methods',
    url: '/admin/payment-methods',
    icon: 'ri-secure-payment-line',
    section: 'Admin Management'
  },
  {
    id: '15',
    name: 'Manage Users',
    url: '/admin/users',
    icon: 'ri-group-line',
    section: 'Admin Management'
  }
]

export default data
