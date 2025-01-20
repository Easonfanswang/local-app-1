import { ProductDataType } from "app/routes/components/ProductListCard";
import { authenticate } from "app/shopify.server";

export const productMutations = async ({
  request,
  data,
}: {
  request: Request;
  data: ProductDataType;
}) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
  mutation createProductMetafields($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        metafields(first: 3) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }`,
    {
      variables: {
        product: {
          title: data.title,
          descriptionHtml: data.descriptionHtml,
        },
      },
    },
  );

  const res = await response.json();
  console.log(res.data.productCreate);
};
