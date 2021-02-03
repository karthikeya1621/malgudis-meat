import type { GetStaticPropsContext } from 'next'
import { getConfig } from '@framework/api'
import getAllPages from '@framework/api/operations/get-all-pages'
import useCustomer from '@framework/use-customer'
import { Layout } from '@components/common'
import cn from 'classnames'
import { useState } from 'react'
import { Customer } from '@framework/api/customers'

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })
  const { pages } = await getAllPages({ config, preview })
  return {
    props: { pages },
  }
}

export default function Profile() {
  const { data } = useCustomer()

  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="w-full profile" style={{ backgroundColor: '#eaeaea', minHeight: '100vh' }}>
      {data && (

        <div className="w-full py-28 mcontainer-xs">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="w-full bg-white rounded-lg shadow-md px-4 py-4 mb-6 text-gray-600 text-sm">
                <h3 className="mb-2 text-xl font-extrabold">{data.firstName} {data.lastName}</h3>
                <span className="mr-2">Email:</span> {data.email}
              </div>

              <div className="ptabs bg-white rounded-lg w-full shadow-md">
                <div onClick={(e) => { setActiveTab('profile') }} className={cn('ptab', { active: activeTab === 'profile' })}>Profile</div>
                <div onClick={(e) => { setActiveTab('orders') }} className={cn('ptab', { active: activeTab === 'orders' })}>Orders</div>
                <div onClick={(e) => { setActiveTab('change_pass') }} className={cn('ptab', { active: activeTab === 'change_pass' })}>Change Password</div>
                <div onClick={(e) => { setActiveTab('help') }} className={cn('ptab', { active: activeTab === 'help' })}>Help Center</div>
                <div onClick={(e) => { setActiveTab('logout') }} className={cn('ptab','logoutbtn', { active: activeTab === 'logout' })}>Logout</div>
              </div>

            </div>
            <div className="lg:col-span-9">
              <div className="pcontent w-full">
                {activeTab === 'profile' ? <ProfileTabContent customer={data} /> : <></>}
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  )
}

const ProfileTabContent = ({customer} : {customer: Customer}) => {
  return <div>Profile</div>
}

Profile.Layout = Layout
