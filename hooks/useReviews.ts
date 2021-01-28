import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type ProductReview = {
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
    data: ProductReview[]
}


const useReviews = async (productId: number) => {
    const config: AxiosRequestConfig = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': process.env.BIGCOMMERCE_STORE_API_TOKEN
        }
    }
    const result = await axios.get<any, AxiosResponse<ProductReviewsResponse>>(`${process.env.BIGCOMMERCE_STORE_API_URL}/v3/catalog/products/${productId}/reviews`, config)
    return result
}

export default useReviews;