import { FC, SyntheticEvent, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Page } from '@framework/api/operations/get-all-pages'
import getSlug from '@lib/get-slug'
import { Github, Vercel } from '@components/icons'
import { Logo, Container, Input, Button } from '@components/ui'
import s from './Footer.module.css'
import CallOutlinedIcon from '@material-ui/icons/CallOutlined'
import AccessTimeOutlinedIcon from '@material-ui/icons/AccessTimeOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import TextArea from '@components/ui/TextArea'

interface Props {
  className?: string
  children?: any
  pages?: Page[]
}

const LEGAL_PAGES = ['terms-of-use', 'shipping-returns', 'privacy-policy']

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages, legalPages } = usePages(pages)
  const rootClassName = cn(className)

  const [feedback, setFeedback] = useState({ comments: '', email: '' })

  const handleComments = (e: any) => {
    setFeedback({ ...feedback, comments: e.target.value })
  }

  const handleEmail = (e: any) => {
    setFeedback({ ...feedback, email: e.target.value })
  }

  const submitFeedback = (e: any) => {
    e.preventDefault();

    // Validate & Submit
  }

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 pb-4 transition-colors duration-150">
          <div className="col-span-1 lg:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="mb-3 pb-1 border-b border-accents-6 uppercase text-sm text-gray-200">Contact</h4>
              <span className="text-lg mb-2">MALGUDIS Store</span>
              <p>Plot No: 94 3rd Lane, Opp ITI Gate, LIC Colony, Vijayawada, Krishna District, Andhra Pradesh, India - 520008</p>
              <div className="py-6">
                <span className="block my-2"><CallOutlinedIcon fontSize="small" /> <a>1800-313-4656</a></span>
                <span className="block my-2"><EmailOutlinedIcon fontSize="small" /> <a>support@malgudis.us</a></span>
                <span className="block my-2"><AccessTimeOutlinedIcon fontSize="small" /> <a>Monday- Satusrday | 8 a.m - 6 p.m</a></span>
              </div>
            </div>
            <div className="py-6 border-t border-accents-8">
              <span>&copy; 2021 Malgudis, Inc. All rights reserved.</span>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-6 px-6">
            <form onSubmit={submitFeedback} className="w-full px-4 py-3 mb-6 rounded bg-gray-100 text-primary">
              <h3 className="border-b pb-3 border-accents-4 mb-4 font-semibold">Give us some feedback !</h3>
              <h5>What do you think of our service? How can we improve it?</h5>
              <div className="formfield pt-4">
                <label className="mb-2 text-sm" htmlFor="comments">Comments</label>
                <TextArea required name="comments" onChange={handleComments} />
              </div>
              <div className="formfield pt-4 mb-5">
                <label className="mb-2 text-sm" htmlFor="email">Email</label>
                <Input required name="email" onChange={handleEmail} />
              </div>
              <Button style={{ background: '#2abb9b' }} className="rounded text-gray-100" variant="slim" type="submit">Submit</Button>
            </form>
          </div>
          {/* <div className="col-span-1 lg:col-span-2">
            <ul className="flex flex-initial flex-col md:flex-1">
              <li className="py-3 md:py-0 md:pb-4">
                <Link href="/">
                  <a className="text-gray-100 hover:text-accents-6 transition ease-in-out duration-150">
                    Home
                  </a>
                </Link>
              </li>
              <li className="py-3 md:py-0 md:pb-4">
                <Link href="/">
                  <a className="text-gray-100 hover:text-accents-6 transition ease-in-out duration-150">
                    Careers
                  </a>
                </Link>
              </li>
              <li className="py-3 md:py-0 md:pb-4">
                <Link href="/blog">
                  <a className="text-gray-100 hover:text-accents-6 transition ease-in-out duration-150">
                    Blog
                  </a>
                </Link>
              </li>
              {sitePages.map((page) => (
                <li key={page.url} className="py-3 md:py-0 md:pb-4">
                  <Link href={page.url!}>
                    <a className="text-gray-100 hover:text-accents-6 transition ease-in-out duration-150">
                      {page.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
          <div className="col-span-1 lg:col-span-3 flex flex-col justify-between text-gray-100">
            <div>
              <h4 className="mb-3 pb-1 border-b border-accents-6 uppercase text-sm text-gray-200">Connect with Us</h4>

            </div>
            <div className="py-6 border-t border-accents-8 flex">
              <span className="mx-3">Sitemap</span>
              <span className="mx-3">Cookie Policy</span>
              <span className="mx-3">Privacy Policy</span>
            </div>
          </div>
        </div>

      </Container>
    </footer>
  )
}

function usePages(pages?: Page[]) {
  const { locale } = useRouter()
  const sitePages: Page[] = []
  const legalPages: Page[] = []

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url)

      if (!slug) return
      if (locale && !slug.startsWith(`${locale}/`)) return

      if (isLegalPage(slug, locale)) {
        legalPages.push(page)
      } else {
        sitePages.push(page)
      }
    })
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
    legalPages: legalPages.sort(bySortOrder),
  }
}

const isLegalPage = (slug: string, locale?: string) =>
  locale
    ? LEGAL_PAGES.some((p) => `${locale}/${p}` === slug)
    : LEGAL_PAGES.includes(slug)

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

export default Footer
