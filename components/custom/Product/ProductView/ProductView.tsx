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
import { FC, useEffect, useState } from 'react'
import s from './ProductView.module.scss'
import cn from 'classnames'
import { Swatch } from '@components/product'
import { camelCase } from 'change-case'
import { Button, Input } from '@components/ui'
import { useStateValue } from 'providers/StateProvider'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import $ from 'jquery'
import ProductReview from '@components/custom/ProductReview'
import { ProductReviewProps } from 'hooks/useReviews'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded'
import Rating from '@material-ui/lab/Rating'
import TextArea from '@components/ui/TextArea'

SwiperCore.use([Navigation])

const ProductView: FC<{
  product: ProductNode
  reviews: ProductReviewProps[]
}> = ({ product, reviews }) => {
  const [state, dispatch] = useStateValue() as any
  let avgRating = ((product as any)?.reviewSummary?.summationOfRatings / (product as any)?.reviewSummary?.numberOfReviews)
  avgRating = avgRating ? avgRating : 0;
  console.log(product)

  useEffect(() => {}, [])

  const setupDescriptionTabs = () => {
    setTimeout(() => {
      if (!$('.description-container').hasClass('show')) {
        $('.description-container').addClass('show')
        $.each($('.description .tab'), (ind, elem) => {
          $(elem).attr('data-index', ind)
          $(elem).find('h1').attr('data-index', ind)
          if (ind === 0) {
            $(elem).addClass('active')
            $(elem).find('h1').addClass('active')
          }
        })
        const headings = Array.from($('.description .tab h1').get())
        $('.description-container .alltabs').append(headings)
        $('.description-container .alltabs h1').on('click', (e: any) => {
          const elem = e.target
          const index = $(elem).attr('data-index')
          if (!$(elem).hasClass('active')) {
            $('.description-container .alltabs h1').removeClass('active')
            $('.description .tab').removeClass('active')
            $(
              `.description-container .alltabs h1[data-index="${index}"]`
            ).addClass('active')
            $(`.description .tab[data-index="${index}"]`).addClass('active')
          }
        })
      }
    }, 700)
  }

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
        variantId: variant?.node.entityId!,
      })
      dispatch({
        type: 'UPDATE_CHOICES',
        payload: { ...choices, variant: variant?.node.entityId },
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const slideChangeHandler = (e: any) => {
    console.log('Slide Changed', e)
  }

  const swiperHandler = (swiper: any) => {
    console.log(swiper)
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
      <div className="mcontainer-sm mx-auto productview">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="col-span-auto">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-2 thumbnails">
                    <Swiper
                      onSwiper={swiperHandler}
                      onSlideChange={slideChangeHandler}
                      className="h-full py-10 px-3 relative"
                      navigation={{
                        nextEl: 'myswiper-button-next',
                        prevEl: 'myswiper-button-prev',
                      }}
                      direction="vertical"
                      slidesPerView={5}
                    >
                      <div
                        className="myswiper-button-prev"
                        onClick={(e) => {
                          console.log(e)
                        }}
                      >
                        <KeyboardArrowUpRoundedIcon />
                      </div>
                      {product.images.edges?.map((image, si) => (
                        <SwiperSlide key={`slide-${si}`}>
                          <img
                            alt=""
                            src={image?.node.urlOriginal}
                            className={cn({ active: image?.node.isDefault })}
                          />
                        </SwiperSlide>
                      ))}
                      <div className="myswiper-button-next">
                        <KeyboardArrowDownRoundedIcon />
                      </div>
                    </Swiper>
                  </div>
                  <div className="col-span-10">
                    <img
                      className="rounded-xl w-full h-auto shadow-xl"
                      alt=""
                      src={
                        product.images.edges
                          ? product.images.edges[0]?.node?.urlOriginal
                          : ''
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-auto">
                {(product as any).inventory?.isInStock ? (
                  <span className={s.instock}>In Stock</span>
                ) : (
                  <span className={s.outstock}>Out of Stock</span>
                )}

                <h2 className="font-medium text-2xl">{product.name}</h2>

                <div className={s.reviewed}>
                  <Rating
                    size="small"
                    readOnly
                    value={avgRating}
                  />{' '}
                  <small>
                    {(product as any)?.reviewSummary?.numberOfReviews} Reviews
                  </small>
                </div>

                <h5 className="text-xl my-5">
                  Price:{' '}
                  <div className={s.price}>
                    <span className="text-default">$</span>
                    <span>
                      {variant
                        ? (variant as any)?.node?.prices?.price?.value
                        : price}
                    </span>
                    {` `}
                    <span className="text-base">
                      {product.prices?.price.currencyCode}
                    </span>
                  </div>
                </h5>

                {options
                  ?.filter((opt: any) => opt.displayName === 'size')
                  .map((opt: any) => (
                    <div className="pb-2 mt-6" key={opt.displayName}>
                      <h2 className="uppercase font-medium">
                        {opt.displayName}
                      </h2>
                      <div className="flex flex-row py-1">
                        {opt.values.map((v: any, i: number) => {
                          let active = (choices as any)[
                            camelCase(opt.displayName)
                          ]
                          if (active === null) {
                            active = opt.values[0].label
                            setChoices((choices) => {
                              return {
                                ...choices,
                                [camelCase(opt.displayName)]: opt.values[0]
                                  .label,
                              }
                            })
                          }
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
                {options
                  ?.filter((opt: any) => opt.displayName === 'custom cuts')
                  .map((opt: any) => (
                    <div className="pb-2 mt-6" key={opt.displayName}>
                      <h2 className="uppercase font-medium">
                        {opt.displayName}
                      </h2>
                      <div className="flex flex-row py-1">
                        <FormControl>
                          <Select
                            variant="outlined"
                            defaultValue={opt.values[0].label}
                            onChange={(e) => {
                              setChoices((choices) => {
                                return {
                                  ...choices,
                                  [camelCase(opt.displayName)]: e.target.value,
                                }
                              })
                            }}
                          >
                            {opt.values.map((v: any, i: number) => {
                              let active = (choices as any)[
                                camelCase(opt.displayName)
                              ]
                              if (active === null) {
                                active = opt.values[0].label
                                setChoices((choices) => {
                                  return {
                                    ...choices,
                                    [camelCase(opt.displayName)]: opt.values[0]
                                      .label,
                                  }
                                })
                              }
                              return (
                                <MenuItem
                                  key={`${v.entityId}-${i}`}
                                  value={v.label}
                                >
                                  {v.label}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  ))}

                {product.productOptions.edges
                  ?.filter((ed) => ed?.node.__typename === 'TextFieldOption')
                  ?.map((tf: any, ind) => {
                    return (
                      <div className="pb-2 mt-6" key={'tf-' + ind}>
                        <h2 className="uppercase font-medium">
                          {tf.node.displayName}
                        </h2>
                        <div className="flex flex-row py-1">
                          <label className="hidden" htmlFor="instructions">
                            Instructions
                          </label>
                          <TextArea name="intructions" className="w-full" style={{resize: 'none'}} />
                        </div>
                      </div>
                    )
                  })}
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

          <div className="col-span-12">
            <div className="description-containerr my-12 w-full">
              <div className="alltabss"></div>
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className={cn(s.description, 'description')}
              ></div>
            </div>

            <div className="reviews-container w-full">
              <ProductReview productId={product.entityId} reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductView
