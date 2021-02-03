import rangeMap from '@lib/range-map'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { getConfig } from '@framework/api'
import getAllProducts from '@framework/api/operations/get-all-products'
import getSiteInfo from '@framework/api/operations/get-site-info'
import getAllPages from '@framework/api/operations/get-all-pages'

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import Sticky from 'react-sticky-el'
import HomeSlider from '@components/common/HomeSlider'
import getCategory, { CategoryResult } from 'graphql/queries/get-category'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import MeatCategory from '@components/custom/MeatCategory'

SwiperCore.use([Navigation, Pagination, Scrollbar])

export async function getStaticProps({
  preview,
  locale,
}: GetStaticPropsContext) {
  const config = getConfig({ locale })

  let meatCategories: CategoryResult[] = []

  // Get Featured Products
  const { products: featuredProducts } = await getAllProducts({
    variables: { field: 'featuredProducts', first: 6 },
    config,
    preview,
  })

  // Get Best Selling Products
  // const { products: bestSellingProducts } = await getAllProducts({
  //   variables: { field: 'bestSellingProducts', first: 6 },
  //   config,
  //   preview,
  // })

  // Get Best Newest Products
  // const { products: newestProducts } = await getAllProducts({
  //   variables: { field: 'newestProducts', first: 12 },
  //   config,
  //   preview,
  // })

  const { categories, brands } = await getSiteInfo({ config, preview })
  const { pages } = await getAllPages({ config, preview })

  // Get Meat Categories
  const getMeatCategories = async () => {
    let promises: Promise<any>[] = []
    categories.forEach((category, index) => {
      if (category.name === 'Meat') {
        promises = category.children.map((mc) =>
          getCategory({ variables: { path: mc.path } })
        )
      }
    })
    meatCategories = await Promise.all(promises)
  }

  await getMeatCategories()

  // const { featured, bestSelling } = (() => {

  //   const products = [...newestProducts]
  //   return {
  //     featured: rangeMap(6, (i) => featuredProducts[i] ?? products.shift())
  //       .filter(nonNullable)
  //       .sort((a, b) => a.node.prices.price.value - b.node.prices.price.value)
  //       .reverse(),
  //     bestSelling: rangeMap(
  //       6,
  //       (i) => bestSellingProducts[i] ?? products.shift()
  //     ).filter(nonNullable),
  //   }
  // })()

  return {
    props: {
      categories,
      meatCategories,
      brands,
      pages,
    },
    revalidate: 14400,
  }
}

const nonNullable = (v: any) => v

export default function Home({
  brands,
  meatCategories,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [catsOffset, setCatsOffset] = useState(131.5)
  const [isSticked, setIsSticked] = useState(false)

  useEffect(() => {
    setCatsOffset(document.getElementById('header-nav')?.clientHeight as number)
    console.log(meatCategories)
  }, [])

  const toggleCatSticky = () => {
    setIsSticked(!isSticked)
  }

  return (
    <>
      <div className="w-full" style={{backgroundColor: '#f2f2f2'}}>
        <HomeSlider />
        <Sticky
          onFixedToggle={toggleCatSticky}
          stickyStyle={{ top: catsOffset, zIndex: 6 }}
          topOffset={-catsOffset}
        >
          <div
            className={cn('meat-categories mcontainer', { sticked: isSticked })}
          >
            <div className="w-full flex justify-between px-12 py-4">
              {meatCategories
                .filter((mc) => mc.defaultImage)
                .map((mc) => (
                  <div
                    key={`mc-${mc.entityId}`}
                    className="meat-category p-2 rounded-lg transition-all duration-300 hover:shadow"
                  >
                    <img src={mc.defaultImage?.url} />
                    <span>{mc.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </Sticky>
        <div className="w-full" style={{ minHeight: '100vh' }}>
          {meatCategories
            .filter((mc) => mc.defaultImage && mc.products.length)
            .map((mc) => (
              <MeatCategory key={`mca-${mc.entityId}`} category={mc} />
            ))}
        </div>
      </div>
      <div style={{ display: 'none' }}>
        {/* <Grid>
          {featured.slice(0, 3).map(({ node }, i) => (
            <ProductCard
              key={node.path}
              product={node}
              imgWidth={i === 0 ? 1080 : 540}
              imgHeight={i === 0 ? 1080 : 540}
              imgPriority
              imgLoading="eager"
            />
          ))}
        </Grid>
        <Marquee variant="secondary">
          {bestSelling.slice(3, 6).map(({ node }) => (
            <ProductCard
              key={node.path}
              product={node}
              variant="slim"
              imgWidth={320}
              imgHeight={320}
              imgLayout="fixed"
            />
          ))}
        </Marquee>
        <Hero
          headline="Release Details: The Yeezy BOOST 350 V2 ‘Natural'"
          description="
        The Yeezy BOOST 350 V2 lineup continues to grow. We recently had the
        ‘Carbon’ iteration, and now release details have been locked in for
        this ‘Natural’ joint. Revealed by Yeezy Mafia earlier this year, the
        shoe was originally called ‘Abez’, which translated to ‘Tin’ in
        Hebrew. It’s now undergone a name change, and will be referred to as
        ‘Natural’."
        />
        <Grid layout="B">
          {featured.slice(3, 6).map(({ node }, i) => (
            <ProductCard
              key={node.path}
              product={node}
              imgWidth={i === 1 ? 1080 : 540}
              imgHeight={i === 1 ? 1080 : 540}
            />
          ))}
        </Grid>
        <Marquee>
          {bestSelling.slice(0, 3).map(({ node }) => (
            <ProductCard
              key={node.path}
              product={node}
              variant="slim"
              imgWidth={320}
              imgHeight={320}
              imgLayout="fixed"
            />
          ))}
        </Marquee>
        <HomeAllProductsGrid
          categories={categories}
          brands={brands}
          newestProducts={newestProducts}
        /> */}
      </div>
    </>
  )
}

Home.Layout = Layout
