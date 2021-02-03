import { BigcommerceConfig, getConfig } from '@framework/api'

export const getCategoryQuery = /* GraphQL */`
query getCategory($path: String!) {
  site {
    route(path: $path) {
      node {
        __typename
        ... on Category {
          name
          path
          entityId
          products (first: 50) {
            edges {
              node {
                name
                path
                entityId
                defaultImage {
                  url(width: 256, height: 256)
                }
                prices {
                  price {
                    value
                    currencyCode
                  }
                }
              }
            }
          }
          defaultImage {
            url(width: 256, height: 256)
          }
        }
      }
    }
  }
}`

export type GetCategoryQueryVariables = ({ path: string })

export type CategoryResult = {
  __typename: string,
  name: string,
  entityId: number,
  products: any[],
  path: string,
  defaultImage: {
    url: string
  }
}

async function getCategory({
  query = getCategoryQuery,
  variables: { path },
  config
}: {
  query?: string,
  variables: GetCategoryQueryVariables,
  config?: BigcommerceConfig
}): Promise<CategoryResult> {
  config = getConfig()
  const variables: GetCategoryQueryVariables = {
    path
  }

  const { data } = await config.fetch<any>(query, { variables })
  const category = data.site?.route?.node
  const products = category.products?.edges?.map((p: { node: any }) => p.node)

  return { ...category, products }
}

export default getCategory
