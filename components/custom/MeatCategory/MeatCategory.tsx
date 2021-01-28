import Link from '@components/ui/Link'
import { CategoryResult } from 'graphql/queries/get-category'
import { useEffect } from 'react'
import MeatProductItem from '../MeatProductItem'

function MeatCategory({ category }: { category: CategoryResult }) {


  return (
    <div className="mcategory w-full mt-24 mb-3 py-3">
      <h1 className="catheading text-3xl text-gray-600 font-bold text-center">
        {category.name}
      </h1>
      <div className="w-full mproducts flex flex-wrap justify-center mcontainer-sm py-12">
        {category.products.map((prod) => {
          return (
              <MeatProductItem key={`mpi-${prod.entityId}1`} category={category}  product={prod} />
          )
        })}
      </div>
    </div>
  )
}

export default MeatCategory
