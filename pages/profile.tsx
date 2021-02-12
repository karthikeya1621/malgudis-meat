import type { GetStaticPropsContext } from 'next'
import { getConfig } from '@framework/api'
import getAllPages from '@framework/api/operations/get-all-pages'
import useCustomer from '@framework/use-customer'
import { Layout } from '@components/common'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { Customer } from '@framework/api/customers'
import { Input } from '@components/ui'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import axios from 'axios'
import { Button } from '@material-ui/core'

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
    <div
      className="w-full profile"
      style={{ backgroundColor: '#eaeaea', minHeight: '100vh' }}
    >
      {data && (
        <div className="w-full py-16 mcontainer-xs">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="w-full bg-white rounded-lg shadow-md px-4 py-4 mb-6 text-gray-600 text-sm">
                <h3 className="mb-2 text-xl font-extrabold">
                  {data.firstName} {data.lastName}
                </h3>
                <span className="mr-2">Email:</span> {data.email}
              </div>

              <div className="ptabs bg-white rounded-lg w-full shadow-md">
                <div
                  onClick={(e) => {
                    setActiveTab('profile')
                  }}
                  className={cn('ptab', { active: activeTab === 'profile' })}
                >
                  Profile
                </div>
                <div
                  onClick={(e) => {
                    setActiveTab('orders')
                  }}
                  className={cn('ptab', { active: activeTab === 'orders' })}
                >
                  Orders
                </div>
                <div
                  onClick={(e) => {
                    setActiveTab('payment')
                  }}
                  className={cn('ptab', { active: activeTab === 'payment' })}
                >
                  Payment Information
                </div>
                <div
                  onClick={(e) => {
                    setActiveTab('change_pass')
                  }}
                  className={cn('ptab', {
                    active: activeTab === 'change_pass',
                  })}
                >
                  Change Password
                </div>
                <div
                  onClick={(e) => {
                    setActiveTab('help')
                  }}
                  className={cn('ptab', { active: activeTab === 'help' })}
                >
                  Help Center
                </div>
                <div
                  onClick={(e) => {
                    setActiveTab('logout')
                  }}
                  className={cn('ptab', 'logoutbtn', {
                    active: activeTab === 'logout',
                  })}
                >
                  Logout
                </div>
              </div>
            </div>
            <div className="lg:col-span-9">
              <div className="pcontent w-full">
                {activeTab === 'profile' ? (
                  <ProfileTabContent customer={data} />
                ) : (
                  <></>
                )}
                {activeTab === 'change_pass' ? (
                  <ChangePasswordTabContent customer={data} />
                ) : (
                  <></>
                )}
                {activeTab === 'payment' ? (
                  <PayInfoTabContent customer={data} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ProfileTabContent = ({ customer }: { customer: Customer }) => {
  const initialNewAddress = {
    first_name: customer.firstName,
    last_name: customer.lastName,
    address1: '',
    city: '',
    state_or_province: '',
    postal_code: '',
    country_code: 'US',
    customer_id: customer.entityId,
    address_type: 'residential',
    phone: customer.phone,
  }

  const [state, setState] = useState({
    infoEditable: false,
    addressAddable: false,
    addressEditable: false
  })
  const [info, setInfo] = useState({
    first_name: customer.firstName,
    last_name: customer.lastName,
    phone: customer.phone,
  })
  const [newAddress, setNewAddress] = useState(initialNewAddress)
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    if (!addresses.length || !state.addressAddable) {
      const fetchAddresses = async () => {
        const result = await axios.post('/api/profile', {
          action: 'get_addresses',
          payload: { 'customer_id:in': customer.entityId },
        })
        console.log(result.data)
        setAddresses(result.data)
      }
      fetchAddresses()
    }
  }, [state.addressAddable])

  const infoEditHandle = async (e: any) => {
    if (state.infoEditable) {
      const result = await axios.post('/api/profile', {
        action: 'update_info',
        payload: { ...info, id: customer.entityId },
      })
      setState({ ...state, infoEditable: false })
    } else {
      setState({ ...state, infoEditable: true })
    }
  }

  const addressAddableHandle = (e: any) => {
    setState({ ...state, addressAddable: !state.addressAddable })
  }

  const addressEditableHandle = (e: any) => {
    setState({...state, addressEditable: !state.addressEditable})
  }

  const addNewAddress = async () => {
    if (newAddress.first_name && newAddress.last_name) {
      const result = await axios.post('/api/profile', {
        action: 'add_address',
        payload: { ...newAddress },
      })
      if (result.data?.length !== undefined) {
        setState({ ...state, addressAddable: false })
      }
    }
  }

  const editAddress = async () => {
    if(newAddress.first_name && newAddress.last_name) {
      const result = await axios.post('/api/profile', {
        action: 'update_address',
        payload: {...newAddress}
      })
      console.log(result);
    }
  }

  return (
    <div className="information">
      <div className="contentset">
        <div className="setheading">
          <h3>Personal Information</h3>
          <span className="actions" onClick={infoEditHandle}>
            {state.infoEditable ? 'Save' : 'Edit'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="fieldSet">
            <label htmlFor="first_name">First Name</label>
            <Input
              onChange={(val) => {
                setInfo({ ...info, first_name: val })
              }}
              disabled={!state.infoEditable}
              defaultValue={customer.firstName}
              name="first_name"
            />
          </div>
          <div className="fieldSet">
            <label htmlFor="last_name">Last Name</label>
            <Input
              onChange={(val) => {
                setInfo({ ...info, last_name: val })
              }}
              disabled={!state.infoEditable}
              defaultValue={customer.lastName}
              name="last_name"
            />
          </div>
          <div className="fieldSet">
            <label htmlFor="mobile">Mobile</label>
            <Input
              onChange={(val) => {
                setInfo({ ...info, phone: val })
              }}
              disabled={!state.infoEditable}
              placeholder={'Not Specified'}
              defaultValue={customer.phone}
              name="mobile"
            />
          </div>
        </div>
      </div>

      <div className="contentset">
        <div className="setheading">
          <h3>Manage Address</h3>
          {addresses.length ? (
            <span className="actions" onClick={addressEditableHandle}>
              {state.addressEditable ? 'Cancel' : 'Edit Address'}
            </span>
          ) : (
            <span className="actions" onClick={addressAddableHandle}>
              {state.addressAddable ? 'Cancel' : 'Add Address'}
            </span>
          )}
        </div>

        {state.addressAddable || state.addressEditable ? (
          <div className="grid grid-cols-2 gap-4">
            {/* <div className="fieldSet">
              <label htmlFor="customer_first_name">Customer First Name</label>
              <Input
                onChange={(val) =>
                  setNewAddress({ ...newAddress, first_name: val })
                }
                name="customer_first_name"
              />
            </div>
            <div className="fieldSet">
              <label htmlFor="customer_last_name">Customer Last Name</label>
              <Input
                onChange={(val) =>
                  setNewAddress({ ...newAddress, last_name: val })
                }
                name="customer_last_name"
              />
            </div> */}
            <div className="fieldSet">
              <label htmlFor="address1">Street Address</label>
              <Input
                onChange={(val) =>
                  setNewAddress({ ...newAddress, address1: val })
                }
                name="address1"
                defaultValue={(addresses as any[])[0]?.address1}
              />
            </div>
            <div className="fieldSet">
              <label htmlFor="city">City</label>
              <Input
                onChange={(val) => setNewAddress({ ...newAddress, city: val })}
                name="city"
              />
            </div>
            <div className="fieldSet">
              <label htmlFor="state_or_province">State</label>
              <Input
                onChange={(val) =>
                  setNewAddress({ ...newAddress, state_or_province: val })
                }
                name="state_or_province"
              />
            </div>
            <div className="fieldSet">
              <label htmlFor="postal_code">Zip Code</label>
              <Input
                onChange={(val) =>
                  setNewAddress({ ...newAddress, postal_code: val })
                }
                name="postal_code"
              />
            </div>
            {/* <div className="fieldSet">
              <label htmlFor="phone">Phone</label>
              <Input
                onChange={(val) => setNewAddress({ ...newAddress, phone: val })}
                name="phone"
                type="tel"
              />
            </div>
            <div className="fieldSet">
              <label htmlFor="address_type">Address Type</label>
              <Input
                onChange={(val) =>
                  setNewAddress({ ...newAddress, address_type: val })
                }
                name="address_type"
              />
            </div> */}
            <Button
              onClick={(e) => {
                addNewAddress()
              }}
              className="secondary"
            >
              Add
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {addresses
              .filter((a: any, i: number) => i === 0)
              .map((address: any) => (
                <div key={address.id} className="address w-full">
                  <div>
                    <strong>{address.first_name}</strong>{' '}
                    <span>{address.phone}</span>
                  </div>
                  <p>
                    {address.address1}, {address.city},{' '}
                    {address.state_or_province}, {address.postal_code}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ChangePasswordTabContent = ({ customer }: { customer: Customer }) => {
  const [pwds, setPwds] = useState({ current_pass: '', new_pass: '' })
  const [isValid, setIsValid] = useState({ status: false, error: '' })

  const passwordChangeHandle = () => {}

  const checkValidity = () => {
    if (pwds.current_pass === '' || pwds.new_pass === '') {
      setIsValid({ status: false, error: 'Required fields are empty' })
    } else {
      setIsValid({ status: true, error: '' })
    }
  }

  return (
    <div className="information">
      <div className="contentset">
        <div className="setheading">
          <h3>Change Password</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="fieldSet">
            <label htmlFor="current_password">Current Password</label>
            <Input
              onChange={(val) => {
                setPwds({ ...pwds, current_pass: val })
                checkValidity()
              }}
              name="current_password"
            />
          </div>
          <div className="fieldSet">
            <label htmlFor="new_password">New Password</label>
            <Input
              onChange={(val) => {
                setPwds({ ...pwds, new_pass: val })
                checkValidity()
              }}
              name="new_password"
            />
          </div>
        </div>
        <small className="form-error">{isValid.error}</small>
        <Button
          onClick={(e) => {
            passwordChangeHandle()
          }}
          className="secondary mt-3"
        >
          Update
        </Button>
      </div>
    </div>
  )
}

const PayInfoTabContent = ({ customer }: { customer: Customer }) => {
  return <></>
}

Profile.Layout = Layout
