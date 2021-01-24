import { Layout } from '@components/common'
import { getConfig } from '@framework/api'
import getProduct from '@framework/api/operations/get-product'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import s from './ProductPage.module.scss'
import cn from 'classnames'

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
    <div className={cn(s.root, 'productcontainer', 'w-full')}>
      <div className="mcontainer-sm mx-auto">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="col-span-auto">
                <img
                  className="rounded-xl w-full h-auto"
                  alt=""
                  src={
                    product.images.edges
                      ? product.images.edges[0]?.node?.urlOriginal
                      : ''
                  }
                />
              </div>
              <div className="col-span-auto">
                {(product as any).inventory?.isInStock ? (
                  <span className={s.instock}>In Stock</span>
                ) : (
                  <span className={s.outstock}>Out of Stock</span>
                )}

                <h2 className="font-medium text-2xl">{product.name}</h2>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  )
}

ProductPage.Layout = Layout
