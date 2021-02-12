import axios, { AxiosError, AxiosResponse } from 'axios'
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
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
  // Run the middleware
  await runMiddleware(req, res, cors)

  const action = req.body?.action

  if (action === 'update_info') {
    const customerData = req.body?.payload
    axios
      .put(
        `${process.env.BIGCOMMERCE_STORE_API_URL}/v3/customers`,
        [{ ...customerData }],
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`,
          },
        }
      )
      .then((result: AxiosResponse) => {
        res.json({ result: result.statusText })
      })
      .catch((error: AxiosError) => {
        res.json({ error: error.response?.data })
      })
  } else if (action === 'get_addresses') {
    const queries = req.body?.payload
    axios
      .get(
        `${
          process.env.BIGCOMMERCE_STORE_API_URL
        }/v3/customers/addresses?${new URLSearchParams(queries).toString()}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`,
          },
        }
      )
      .then((result: AxiosResponse) => {
        res.json([...result.data.data])
      })
      .catch((error: AxiosError) => {
        res.json({ error: error.response?.data })
      })
  } else if (action === 'add_address') {
    axios
      .post(
        `${process.env.BIGCOMMERCE_STORE_API_URL}/v3/customers/addresses`,
        [{ ...req.body?.payload }],
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`,
          },
        }
      )
      .then((result: AxiosResponse) => {
        res.json([...result.data.data])
      })
      .catch((error: AxiosError) => {
        res.json({ error: error.response?.data })
      })
  } else if (action === 'update_address') {
    axios
      .put(
        `${process.env.BIGCOMMERCE_STORE_API_URL}/v3/customers/addresses`,
        [{ ...req.body?.payload }],
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`,
          },
        }
      )
      .then((result: AxiosResponse) => {
        res.json([...result.data.data])
      })
      .catch((error: AxiosError) => {
        res.json({ error: error.response?.data })
      })
  } else if (action === 'remove_address') {
  } else if (action === 'change_password') {
  }

  // Rest of the API logic
}

export default handler
