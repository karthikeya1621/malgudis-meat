import type { GetStaticPropsContext } from 'next'
import { getConfig } from '@framework/api'
import getAllPages from '@framework/api/operations/get-all-pages'
import useCustomer from '@framework/use-customer'
import { Layout } from '@components/common'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { Customer } from '@framework/api/customers'
import { Input } from '@components/ui'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axios from 'axios'

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
                <div onClick={(e) => { setActiveTab('logout') }} className={cn('ptab', 'logoutbtn', { active: activeTab === 'logout' })}>Logout</div>
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

const ProfileTabContent = ({ customer }: { customer: Customer }) => {

  console.log(customer)

  const [state, setState] = useState({infoEditable: false})
  const [info, setInfo] = useState({first_name: customer.firstName, last_name: customer.lastName, phone: customer.phone})
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    if(!addresses.length) {
      const fetchAddresses = async () => {
        const result = await axios.post('/api/profile', {action: 'get_addresses', payload : {'customer_id:in' : customer.entityId}})
        setAddresses(result.data)
      }
      fetchAddresses()
    }
  }, [])

  const infoEditHandle = async (e: any) => {
    if(state.infoEditable) {
      const result = await axios.post('/api/profile', {action: 'update_info', payload: {...info, id: customer.entityId}})
      setState({...state, infoEditable: false})
    } else {
      setState({...state, infoEditable: true})
    }
  }

  return (
    <div className="information">
      <div className="contentset">
        <div className="setheading">
          <h3>Personal Information</h3>
          <span className="actions" onClick={infoEditHandle}>{(state.infoEditable ? 'Save' : 'Edit')}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="fiedlSet">
            <label htmlFor="first_name">First Name</label>
            <Input onChange={(val) => {setInfo({...info, first_name: val})}} disabled={!state.infoEditable} defaultValue={customer.firstName} name="first_name"  />
          </div>
          <div className="fiedlSet">
            <label htmlFor="last_name">Last Name</label>
            <Input onChange={(val) => {setInfo({...info, last_name: val})}} disabled={!state.infoEditable} defaultValue={customer.lastName} name="last_name"  />
          </div>
          <div className="fiedlSet">
            <label htmlFor="mobile">Mobile</label>
            <Input onChange={(val) => {setInfo({...info, phone: val})}} disabled={!state.infoEditable} placeholder={'Not Specified'} defaultValue={customer.phone} name="mobile"  />
          </div>
        </div>
      </div>

      <div className="contentset">
        <div className="setheading">
          <h3>Manage Addresses</h3>
          <span className="actions">Add Address</span>
        </div>
        <div className="grid grid-cols-1">
          <div className="address w-full">
            <div className="options">
              <EditOutlinedIcon fontSize="small" />
              <DeleteOutlinedIcon fontSize="small" />
            </div>
            <div><strong>Name</strong> <span>1234567890</span></div>
            <p>Address</p>
          </div>

          <div className="address w-full">
          <div className="options">
              <EditOutlinedIcon fontSize="small" />
              <DeleteOutlinedIcon fontSize="small" />
            </div>
            <div><strong>Name</strong> <span>1234567890</span></div>
            <p>Address</p>
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.Layout = Layout
