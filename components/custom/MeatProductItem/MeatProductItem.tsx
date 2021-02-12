import Link from '@components/ui/Link'
import Rating from '@material-ui/lab/Rating'
import { CategoryResult } from 'graphql/queries/get-category'
import { useEffect } from 'react'

function MeatProductItem({
  product,
  category,
  counter,
}: {
  product: any
  category: CategoryResult
  counter: number
}) {
  const catSlug = last(category.path.split('/'))
  const prodSlug = last(product.path.split('/'))

  return (
    <Link href={`/${catSlug}/${prodSlug}`}>
      <div className="mproduct border-l border-r col-span-1 px-10">
        <span className="prodnum">{counter}</span>
        <img alt="" src={product.defaultImage?.url} />
        <div className="flex justify-between mt-4 mb-1">
          <div className="info px-1">
            <h6 className="text-left">{product.name}</h6>
          </div>
          <div>
            <small className="text-3xl font-medium text-gray-700">
              <span className="text-lg">$</span>
              <span>{product.prices?.price.value}</span>
            </small>
          </div>
        </div>
      </div>
    </Link>
  )
}

function last(array: any[]) {
  return array[array.length - 2]
}

export default MeatProductItem
