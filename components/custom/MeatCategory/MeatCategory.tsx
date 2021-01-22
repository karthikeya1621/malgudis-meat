import { CategoryResult } from 'graphql/queries/get-category'
import MeatProductItem from '../MeatProductItem'

function MeatCategory({ category }: { category: CategoryResult }) {
  return (
    <div className="mcategory w-full mt-24 mb-3 py-3">
      <h1 className="catheading text-3xl text-gray-600 font-bold text-center">{category.name}</h1>
      <div className="w-full mproducts flex justify-between mcontainer-sm py-12">
        {category.products.map((prod) => (
          <MeatProductItem product={prod} />
        ))}
      </div>
    </div>
  )
}

export default MeatCategory
