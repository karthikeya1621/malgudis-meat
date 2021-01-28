import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type ProductReviewProps = {
    id: number,
    email: string,
    name?: string,
    rating: number,
    text: string,
    title?: string,
    status: string,
    date_created?: string,
    date_modified?: string,
    date_reviewed: string
}

export type ProductReviewsResponse = {
    data: ProductReviewProps[]
}


const useReviews = async (productId: number) => {
    const config: AxiosRequestConfig = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': process.env.BIGCOMMERCE_STORE_API_TOKEN || 'bnlin6teliqpm4u2navk1lqkydzzer6'
        }
    }
    const result = await axios.get<any, AxiosResponse<ProductReviewsResponse>>(`${process.env.BIGCOMMERCE_STORE_API_URL || 'https://api.bigcommerce.com/stores/3l7whoi1t5'}/v3/catalog/products/${productId}/reviews`, config)
    return result
}

export default useReviews;
