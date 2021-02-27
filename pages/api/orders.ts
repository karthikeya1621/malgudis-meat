import axios, { AxiosError, AxiosResponse } from 'axios'
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
})

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

async function handler(req: any, res: any) {
  await runMiddleware(req, res, cors)

  const action = req.body.action
  const payload = req.body.payload

  if (action === 'get_all_orders') {
    const queries = new URLSearchParams(payload).toString()
    axios
      .get(`${process.env.BIGCOMMERCE_STORE_API_URL}/v2/orders?${queries}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`,
        },
      })
      .then((result: AxiosResponse) => {
        if (result.data.length) {
          const productFetchers = result.data.map((order: any) =>
            axios.get(
              `${process.env.BIGCOMMERCE_STORE_API_URL}/v2/orders/${order.id}/products`,
              {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`,
                },
              }
            )
          );
          
          Promise.allSettled(productFetchers).then((prodListRes: unknown) => {
              const prodList = (prodListRes as any[]).map((prodResp) => prodResp.value.data)

              const ordersWithProds = result.data.map((order: any, index: number) => {
                  return {...order, products: prodList[index]}
              })
              res.json(Array.from(ordersWithProds))
          })
        } else {
          res.json({})
        }
      })
      .catch((error: AxiosError) => {
        console.log(error.response)
        res.json({ error: error.response?.data })
      })
  }
}

export default handler
