import { Layout } from '@components/common'
import { getConfig } from '@framework/api'
import getProduct from '@framework/api/operations/get-product'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import s from './ProductPage.module.scss'
import cn from 'classnames'
import { ProductView } from '@components/custom/Product'

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

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  return {
    props: {
      product,
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
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  console.log(router.query)
  console.log(product)
  return (
    <ProductView product={product} />
  )
}

ProductPage.Layout = Layout
