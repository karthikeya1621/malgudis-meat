import axios, { AxiosError, AxiosResponse } from 'axios'
import Cors from 'cors'
import moment from 'moment-timezone'

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'HEAD', 'POST'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
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


    axios.post(`${process.env.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products/${req.body.productId}/reviews`, { ...req.body }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': `${process.env.BIGCOMMERCE_STORE_API_TOKEN}`
        }
    }).then((result: AxiosResponse) => {
        console.log(result.statusText)
        res.json({ result: result.statusText })
    }).catch((error: AxiosError) => {
        console.log(error.response?.data)
        res.json({ response: error.response?.data })
    })

    // Rest of the API logic

}

export default handler
