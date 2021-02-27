import type { GetStaticPropsContext } from 'next'
import { getConfig } from '@framework/api'
import getAllPages from '@framework/api/operations/get-all-pages'
import { Layout } from '@components/common'
import { Container as div, Text } from '@components/ui'
import { Bag } from '@components/icons'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useCustomer from '@framework/use-customer'

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

export default function Orders() {
  const [orders, setOrders] = useState({
    completed: [],
    pending: [],
    ongoing: [],
  })
  const { data: customer } = useCustomer()

  useEffect(() => {
    if (customer && !orders.completed.length && !orders.pending.length) {
      const fetchOrders = async () => {
        const result = await axios.post('/api/orders', {
          action: 'get_all_orders',
          payload: { customer_id: customer?.entityId },
        })
        if (result.data) {
          const tempState = {
            completed: [] as any[],
            pending: [] as any[],
            ongoing: [] as any[],
          } as any
          ;(result.data as any[]).forEach((order: any) => {
            const pendingStatuses = [0, 1]
            const ongoingStatuses = [2, 7, 8, 9, 11]
            const completedStatuses = [10]
            const statusId = order.status_id
            if (pendingStatuses.includes(statusId)) {
              tempState.pending.push(order)
            } else if (completedStatuses.includes(statusId)) {
              tempState.completed.push(order)
            } else if (ongoingStatuses.includes(statusId)) {
              tempState.ongoing.push(order)
            }
            setOrders(tempState)
          })
        }
      }
      fetchOrders()
    }
    console.log(orders)
  }, [orders, customer])

  return (
    <div className="w-full orderscontainer">
      {orders.completed.length ||
      orders.pending.length ||
      orders.ongoing.length ? (
        <div className="px-6 py-12 mcontainer-sm w-full">
          <Text variant="pageHeading">My Orders</Text>
          <div className="w-full allorders">
            {orders.ongoing.length ? <div className="ordersection">
              {
                orders.ongoing.map((order: any) => <OngoingOrder order={order} key={order.id} />)
              }
            </div> : <></>}

            {orders.pending.length ? <div className="ordersection">
              {
                orders.pending.map((order: any) => <PendingOrder order={order} key={order.id} />)
              }
            </div> : <></>}

            {orders.completed.length ? <div className="ordersection">
              {
                orders.completed.map((order: any) => <CompletedOrder order={order} key={order.id} />)
              }
            </div> : <></>}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-24 flex flex-col justify-center items-center ">
          <span className="border border-dashed border-secondary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-primary text-primary">
            <Bag className="absolute" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            No orders found
          </h2>
        </div>
      )}
    </div>
  )
}

Orders.Layout = Layout

const OngoingOrder = ({order}: {order: any}) => {
  return <div className="morder ongoing">
    <h3 className="text-lg font-medium pb-1 border-b">Ongoing</h3>
  </div>
}

const PendingOrder = ({order}: {order: any}) => {
  return <div className="morder pending">
    <h3 className="text-lg font-medium pb-1 border-b">Pending</h3>
  </div>
}

const CompletedOrder = ({order}: {order: any}) => {
  return <div className="morder completed">
    <h3 className="text-lg font-medium pb-1 border-b">Completed</h3>
  </div>
}
