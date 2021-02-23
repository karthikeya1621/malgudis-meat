import { FC } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import useCart from '@framework/cart/use-cart'
import useCustomer from '@framework/use-customer'
import { Heart, Bag } from '@components/icons'
import { useUI } from '@components/ui/context'
import DropdownMenu from './DropdownMenu'
import s from './UserNav.module.css'
import { Avatar } from '@components/common'
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import useLogout from '@framework/use-logout'
import { useRouter } from 'next/router'
import Rating from '@material-ui/lab/Rating'

interface Props {
  className?: string
  visible?: boolean
  toggleMenu?: any
}

const countItem = (count: number, item: any) => count + item.quantity
const countItems = (count: number, items: any[]) =>
  items.reduce(countItem, count)

const UserNav: FC<Props> = ({
  toggleMenu,
  visible,
  className,
  children,
  ...props
}) => {
  const { data } = useCart()
  const router = useRouter()
  const logout = useLogout()
  const { data: customer } = useCustomer()
  const { toggleSidebar, closeSidebarIfPresent, openModal } = useUI()
  const itemsCount = Object.values(data?.line_items ?? {}).reduce(countItems, 0)

  const dropdownEl = null

  const timedFunction = (func: any, params: any[]) => {
    setTimeout(() => {
      func(params[0])
      router.push(params[1])
    }, 200)
  }

  return (
    <nav className={cn(s.root, className)}>
      <div className={s.mainContainer}>
        <div
          className="flex w-full flex-col items-center pt-3 pb-5 md:hidden"
          onClick={() => {
            timedFunction(toggleMenu, [false, '/reviews'])
          }}
        >
          <Rating readOnly value={4} size="small" />
          <h3 className="text-lg font-medium my-2">
            4 / <span className="text-sm">5</span>
          </h3>
          <small className="text-xs">Based on 4 reviews</small>
        </div>
        <ul className={s.list}>
          <li className={s.item}>
            <LocationOnOutlinedIcon />{' '}
            <span className={s.itemLabel}>Park Avenue, Minnesota</span>
          </li>
          <li
            className={cn(s.item, 'hidden md:flex scartlink')}
            onClick={toggleSidebar}
          >
            <ShoppingCartOutlinedIcon />{' '}
            <span className={s.itemLabel}>Cart</span>
            {itemsCount > 0 && <span className={s.bagCount}>{itemsCount}</span>}
          </li>
          <li className={cn(s.item, 'hidden md:flex dmenulink')}>
            {customer ? (
              <div className="inline-flex align-center pt-2">
                <DropdownMenu />{' '}
                <span className={s.itemLabel}>{customer.firstName}</span>
              </div>
            ) : (
              <button
                className={s.avatarButton}
                aria-label="Menu"
                onClick={() => openModal()}
              >
                <Avatar /> <span className={s.itemLabel}>Login / Register</span>
              </button>
            )}
          </li>
          {customer ? (
            <li
              className={cn(s.item, 'flex md:hidden smlinks')}
              onClick={() => {
                timedFunction(toggleMenu, [false, '/profile'])
              }}
            >
              <Link href="/profile">
                <>
                  <AccountCircleOutlinedIcon /> My Account
                </>
              </Link>
            </li>
          ) : (
            <></>
          )}
          <li
            className={cn(s.item, 'flex md:hidden smlinks')}
            onClick={() => {
              timedFunction(toggleMenu, [false, '/cart'])
            }}
          >
            <Link href="/cart">
              <>
                <ShoppingCartOutlinedIcon /> My Cart
              </>
            </Link>
          </li>
          {customer ? (
            <li
              className={cn(s.item, 'flex md:hidden smlinks')}
              onClick={() => {
                toggleMenu(false)
                logout()
              }}
            >
              <>
                <ExitToAppOutlinedIcon /> Logout
              </>
            </li>
          ) : (
            <></>
          )}
          {
            customer ? <></> : <li
            className={cn(s.item, 'flex md:hidden smlinks')}
            onClick={() => {
              toggleMenu(false)
              openModal()
            }}
          >
            <>
              <ExitToAppOutlinedIcon /> Login / Register
            </>
          </li>
          }
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
