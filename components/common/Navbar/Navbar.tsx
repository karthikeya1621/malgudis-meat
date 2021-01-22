import { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import s from './Navbar.module.scss'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import cn from 'classnames'
import throttle from 'lodash.throttle'
import InfoBar from '../InfoBar'
import Rating from '@material-ui/lab/Rating'


const Navbar: FC = () => {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const offset = 0
      const { scrollTop } = document.documentElement
      const scrolled = scrollTop > offset
      setHasScrolled(scrolled)
    }, 200)

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div id="header-nav" className={cn(s.root, { 'shadow-magical': hasScrolled })}>
      <InfoBar />
      <Container>
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            {/* <nav className="hidden ml-6 space-x-4 lg:block">
              <Link href="/search">
                <a className={s.link}>All</a>
              </Link>
              <Link href="/search?q=clothes">
                <a className={s.link}>Clothes</a>
              </Link>
              <Link href="/search?q=accessories">
                <a className={s.link}>Accessories</a>
              </Link>
            </nav> */}
          </div>

          <div className="justify-center items-center flex-1 hidden lg:flex">
            {/* <Searchbar /> */}
            <Rating className={s.rating} value={4.3} precision={0.1} readOnly />
          </div>

          <div className="flex justify-end flex-1 space-x-8">
            <UserNav />
          </div>
        </div>

        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Searchbar id="mobile-search" />
        </div>
      </Container>
    </div>
  )
}

export default Navbar
