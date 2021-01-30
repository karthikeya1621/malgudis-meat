import { Layout } from '@components/common'
import { getConfig } from '@framework/api'
import getProduct from '@framework/api/operations/get-product'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import s from './ProductPage.module.scss'
import cn from 'classnames'
import { ProductView } from '@components/custom/Product'
import { useStateValue } from 'providers/StateProvider'
import { useEffect } from 'react'
import { getStateLocal, isStateLocal } from 'providers/StateProvider/StateReducer'
import useReviews, { ProductReviewProps } from 'hooks/useReviews'

export async function getStaticProps({
  params,
  preview,
  locale,
}: GetStaticPropsContext<{ slug: string }>) {
  const config = getConfig({ locale })

  const { product } = await getProduct({
    variables: { slug: params!.slug },
    config,
    preview,
  })

  const reviews = await useReviews(product?.entityId as number)


  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: {
      product,
      reviews: reviews?.data.data ? (reviews?.data.data) : []
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default function ProductPage({
  product,
  reviews
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()


  const [state, dispatch] = useStateValue() as any
  useEffect(() => {
    const syncLocal = async () => {
      const result = await getStateLocal()
      if (await isStateLocal()) {
        dispatch({
          type: 'SYNC_CHOICES',
          payload: [...result]
        })
      }
    }
    syncLocal()
  }, [])

  return (
    <ProductView reviews={reviews} product={product} />
  )
}

ProductPage.Layout = Layout
