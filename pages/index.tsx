import rangeMap from '@lib/range-map'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero, Input } from '@components/ui'
import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import $ from 'jquery'

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
import { Checkbox, FormControlLabel, FormGroup, withStyles } from '@material-ui/core'
import { green } from '@material-ui/core/colors'

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

const GreenCheckbox: any = withStyles({
  root: {
    color: 'default',
    '&$checked': {
      color: green[800],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function Home({
  brands,
  meatCategories,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [catsOffset, setCatsOffset] = useState(131.5)
  const [isSticked, setIsSticked] = useState(false)
  const [prodFilters, setProdFilters] = useState(meatCategories.map(m => [] as any[]))
  const [filterSearch, setFilterSearch] = useState(meatCategories.map(m => ''))
  const [activeCats, setActiveCats] = useState([] as any[])

  useEffect(() => {
    setCatsOffset(document.getElementById('header-nav')?.clientHeight as number)
    console.log(meatCategories)

    setTimeout(() => {
      if(window !== null && meatCategories.length && false){
        $(window).on('scroll',(e: Event) => {
          const elemTops = meatCategories.map(mc => {
            const starttop = window.scrollY + (document?.querySelector('#cat-'+mc.entityId)?.getBoundingClientRect()?.top as number) - 150
            const endbottom = window.scrollY + (document?.querySelector('#cat-'+mc.entityId)?.clientHeight as number) + (document?.querySelector('#cat-'+mc.entityId)?.getBoundingClientRect()?.top as number) - 150
            return ({starttop, name: mc.name, endbottom})
          })
          const starttop = window.scrollY + (document?.querySelector('#cat-'+meatCategories[0].entityId)?.getBoundingClientRect()?.top as number) - 150
          const endbottom = window.scrollY + 300 + (document?.querySelector('#cat-'+meatCategories[meatCategories.length - 1].entityId)?.getBoundingClientRect()?.top as number) - 150
          const activCats = elemTops.filter(et => window.pageYOffset > et.starttop && window.pageYOffset < et.endbottom - 200).map(ac => ac.name)
          if(window.pageYOffset > starttop && window.pageYOffset < endbottom){
            if(activeCats.join('') !== activCats.join(''))
            setActiveCats(activCats)
          } else {
            if(activeCats.length){
              setActiveCats([])
            }
          }
        })
      }
    }, 1000)
  }, [])


  const toggleCatSticky = () => {
    setIsSticked(!isSticked)
  }


  return (
    <>
      <div className="w-full" style={{ backgroundColor: '#fefefe' }}>
        <HomeSlider />
        <Sticky
          onFixedToggle={toggleCatSticky}
          stickyStyle={{ top: catsOffset, zIndex: 6 }}
          topOffset={-catsOffset}
          disabled={true}
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
                    onClick={() => {
                      const top = window.scrollY + (document?.querySelector('#cat-'+mc.entityId)?.getBoundingClientRect()?.top as number) - 160
                      window.scrollTo({top})
                    }}
                  >
                    <img src={mc.defaultImage?.url} />
                    <span>{mc.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </Sticky>

        <div className="w-full mcontainer-sm grid mt-24 grid-cols-4 gap-6">
          <div className="col-span-1 homefilter pr-3">
            <h1 className="text-lg text-gray-800 border-b mt-2">Filters</h1>
            {meatCategories
              .filter((mc) => mc.defaultImage && mc.products.length)
              .map((mc, mci) => (
                <Sticky key={`mcf-${mc.entityId}`} stickyStyle={{ top: catsOffset, zIndex: 6 + mci, backgroundColor: 'white' }}
                topOffset={-catsOffset}
                disabled={activeCats.includes(mc.name) ? false : true}>
                  <div key={`mcf-${mc.entityId}`} className="filter-category mt-8">
                  <h1 className="text-2xl font-medium text-gray-700 mb-3">{mc.name}</h1>
                  <Input className="w-full mb-2" placeholder={`Search in ${mc.name}`} onChange={(val) => {
                    let searchTerms = [...filterSearch];
                    searchTerms[mci] = val
                    setFilterSearch(searchTerms)
                    }} />
                  <div className="checkgroup mb-12 flex-col">
                    {mc.products.map((product : any) => {
                      let isSearched = false;
                      if(filterSearch[mci] === undefined || filterSearch[mci] === '') {
                        isSearched = false;
                      } else{
                        isSearched = true;
                      }
                      return ( !isSearched || product.name.toLowerCase().includes(filterSearch[mci].toLowerCase()) ?
                        <FormControlLabel key={`mpf-${product.entityId}`}
                        control={<GreenCheckbox  onChange={(e: any) => {
                          if(e.target.checked){
                            if(!prodFilters[mci].includes(product.entityId)) {
                              let clone = Array.from(prodFilters)
                              clone[mci] = [...clone[mci], product.entityId]
                              setProdFilters(Array.from(clone))
                            }
                          } else {
                            if(prodFilters[mci].includes(product.entityId)) {
                              const removed = prodFilters[mci].filter(pid => pid !== product.entityId)
                              let clone = Array.from(prodFilters)
                              clone[mci] = [...removed]
                              setProdFilters(Array.from(clone))
                            }
                          }

                        }} />}
                        label={product.name}
                      /> : <></>
                      )
                    })}
                  </div>
                </div>
                </Sticky>
              ))}
          </div>
          <div className="col-span-3">
            <div className="w-full">{
              meatCategories
                .filter((mc) => mc.defaultImage && mc.products.length)
                .map((mc, mci) => (
                  <MeatCategory search={filterSearch[mci]} prodFilters={prodFilters[mci]}  key={`mca-${mc.entityId}`} category={mc} />
                ))}
            </div>
          </div>
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
