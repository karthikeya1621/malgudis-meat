import Link from '@components/ui/Link'
import { CategoryResult } from 'graphql/queries/get-category'
import { useEffect } from 'react'

function MeatProductItem({
  product,
  category,
  counter
}: {
  product: any
  category: CategoryResult,
  counter: number
}) {
  const catSlug = last(category.path.split('/'))
  const prodSlug = last(product.path.split('/'))
  console.log(last(category.path.split('/')))

  return (
    <Link href={`/${catSlug}/${prodSlug}`}>
      <div className="mproduct shadow-sm hover:shadow-lg rounded-xl border">
        <span className="prodnum">{counter}</span>
        <img alt="" src={product.defaultImage?.url} />
        <div className="info">
          <h6>{product.name}</h6>
          <small className="text-base font-bold">
            <span>$</span> <span>{product.prices?.price.value}</span>
          </small>
        </div>
      </div>
    </Link>
  )
}

function last(array: any[]) {
  return array[array.length - 2];
}

export default MeatProductItem
