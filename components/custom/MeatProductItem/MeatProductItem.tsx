function MeatProductItem({ product }: { product: any }) {
  console.log(product)
  return (
    <div className="mproduct shadow-sm hover:shadow-lg rounded-xl border">
      <img alt="" src={product.defaultUrl?.url} />
      <div className="info">
        <h6>{product.name}</h6>
        <small className="text-base font-bold">
          <span>$</span> <span>{product.prices?.price.value}</span>
        </small>
      </div>
    </div>
  )
}

export default MeatProductItem
