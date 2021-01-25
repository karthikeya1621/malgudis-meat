import {
  getCurrentVariant,
  getProductOptions,
  SelectedOptions,
} from '@components/product/helpers'
import { useUI } from '@components/ui/context'
import { ProductNode } from '@framework/api/operations/get-product'
import useAddItem from '@framework/cart/use-add-item'
import usePrice from '@framework/use-price'
import { NextSeo } from 'next-seo'
import { FC, useState } from 'react'
import s from './ProductView.module.scss'
import cn from 'classnames'
import { Swatch } from '@components/product'
import { camelCase } from 'change-case'
import { Button } from '@components/ui'

const ProductView: FC<{ product: ProductNode }> = ({ product }) => {
  const addItem = useAddItem()

  const { price } = usePrice({
    amount: product.prices?.price?.value,
    baseAmount: product.prices?.retailPrice?.value,
    currencyCode: product.prices?.price?.currencyCode!,
  })

  const { openSidebar } = useUI()
  const options = getProductOptions(product)
  const [loading, setLoading] = useState(false)
  const [choices, setChoices] = useState<SelectedOptions>({
    size: null,
    customCuts: null,
  })
  const variant =
    getCurrentVariant(product, choices) || product.variants.edges?.[0]

  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: product.entityId,
        variantId: product.variants.edges?.[0]?.node.entityId!,
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className={cn(s.root, 'productcontainer', 'w-full')}>
      <NextSeo
        title={product.name}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.description,
          images: [
            {
              url: product.images.edges?.[0]?.node.urlOriginal!,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />
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

                <h5 className="text-xl my-3">
                  Price:{' '}
                  <span className={s.price}>
                    {price}
                    {` `}
                    {product.prices?.price.currencyCode}
                  </span>
                </h5>

                {options?.map((opt: any) => (
                  <div className="pb-4" key={opt.displayName}>
                    <h2 className="uppercase font-medium">{opt.displayName}</h2>
                    <div className="flex flex-row py-4">
                      {opt.values.map((v: any, i: number) => {
                        const active = (choices as any)[
                          camelCase(opt.displayName)
                        ]
                        return (
                          <Swatch
                            key={`${v.entityId}-${i}`}
                            active={v.label === active}
                            variant={camelCase(opt.displayName) as any}
                            label={v.label}
                            onClick={() => {
                              setChoices((choices) => {
                                return {
                                  ...choices,
                                  [camelCase(opt.displayName)]: v.label,
                                }
                              })
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={addToCart}
              loading={loading}
              disabled={!variant}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductView
