import Link from '@components/ui/Link'
import { CategoryResult } from 'graphql/queries/get-category'
import { useEffect, useState } from 'react'
import MeatProductItem from '../MeatProductItem'

function MeatCategory({
  category,
  prodFilters,
  search,
}: {
  category: CategoryResult
  prodFilters: any[]
  search: string
}) {
  return (
    <div id={'cat-'+category.entityId} className="mcategory w-full mt-18 mb-3 py-3">
      {
        <h1 className="catheading text-xl text-gray-500 border-b font-bold text-left">
          {category.name}
        </h1>
      }
      <div className="w-full mproducts grid grid-cols-2 sm:grid-cols-3 py-6 md:py-12">
        {category.products
          .filter((prod, ind) => {
            let isSearched = false
            if (search === undefined || search === '') {
              isSearched = false
            } else {
              isSearched = true
            }
            return (
              (!prodFilters.length && !isSearched) ||
              (prodFilters.includes(prod.entityId) && prodFilters.length) ||
              (prod.name.toLowerCase().includes(search.toLowerCase()) &&
                isSearched &&
                !prodFilters.length)
            )
          })
          .map((prod, ind) => {
            return (
              <MeatProductItem
                counter={ind + 1}
                key={`mpi-${prod.entityId}1`}
                category={category}
                product={prod}
              />
            )
          })}
      </div>
    </div>
  )
}

export default MeatCategory
