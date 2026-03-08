// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

type DefaultSuggestionsType = {
  sectionLabel: string
  items: {
    label: string
    href: string
    icon?: string
  }[]
}

const defaultSuggestions: DefaultSuggestionsType[] = [
  {
    sectionLabel: 'User Access',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'ri-home-smile-line'
      },
      {
        label: 'Explore Activities',
        href: '/activities',
        icon: 'ri-map-pin-user-line'
      },
      {
        label: 'All Promos',
        href: '/promos',
        icon: 'ri-discount-percent-line'
      },
      {
        label: 'My Cart',
        href: '/cart',
        icon: 'ri-shopping-cart-2-line'
      }
    ]
  },
  {
    sectionLabel: 'Admin Management',
    items: [
      {
        label: 'Manage Activities',
        href: '/admin/activities',
        icon: 'ri-map-2-line'
      },
      {
        label: 'Manage Promos',
        href: '/admin/promos',
        icon: 'ri-discount-percent-line'
      },
      {
        label: 'Manage Banners',
        href: '/admin/banners',
        icon: 'ri-image-line'
      },
      {
        label: 'Manage Categories',
        href: '/admin/categories',
        icon: 'ri-grid-fill'
      }
    ]
  },
  {
    sectionLabel: 'Account & Users',
    items: [
      {
        label: 'Account Settings',
        href: '/account',
        icon: 'ri-user-settings-line'
      },
      {
        label: 'User Management',
        href: '/admin/users',
        icon: 'ri-group-line'
      },
      {
        label: 'Admin Dashboard',
        href: '/admin',
        icon: 'ri-dashboard-line'
      }
    ]
  },
  {
    sectionLabel: 'Transactions',
    items: [
      {
        label: 'My Transactions',
        href: '/transactions',
        icon: 'ri-list-check'
      },
      {
        label: 'All Transactions (Admin)',
        href: '/admin/transactions',
        icon: 'ri-bank-card-line'
      },
      {
        label: 'Payment Methods',
        href: '/admin/payment-methods',
        icon: 'ri-secure-payment-line'
      }
    ]
  }
]

const DefaultSuggestions = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  // Hooks
  const { lang: locale } = useParams()

  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {defaultSuggestions.map((section, index) => (
        <div
          key={index}
          className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'
        >
          <p className='text-xs uppercase text-textDisabled tracking-[0.8px]'>{section.sectionLabel}</p>
          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li key={i} className='flex'>
                <Link
                  href={getLocalizedUrl(item.href, locale as Locale)}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <i className={classnames(item.icon, 'flex text-xl')} />}
                  <p className='text-[15px] overflow-hidden whitespace-nowrap overflow-ellipsis'>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
