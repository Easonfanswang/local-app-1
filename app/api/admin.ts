import {
  ProductDataType,
  VariantDataType,
} from "app/routes/components/ProductListCard";
import { authenticate } from "app/shopify.server";

const convertOptionsFormat = (productOptions: Record<string, string[]>) => {
  return Object.entries(productOptions).map(([name, values]) => ({
    name,
    values: values.map((value) => ({ name: value })),
  }));
};

export const productMutations = async ({
  request,
  data,
}: {
  request: Request;
  data: ProductDataType;
}) => {
  const { admin } = await authenticate.admin(request);
  let productOptions;
  if (data?.productOptions) {
    productOptions = convertOptionsFormat(data?.productOptions);
  }
  try {
    const response = await admin.graphql(
      `#graphql
      mutation createProductMetafields($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            descriptionHtml
            options {
            id
            name
            position
            optionValues {
              id
              name
              hasVariants
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price
                sku
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
            productOptions: productOptions,
          },
        },
      },
    );

    const res = await response.json();
    console.log(res.data.productCreate);
    const productId = res.data.productCreate.product.id;
    await productVariantsMutations({
      request,
      productId,
      data: data.variants,
    });
  } catch (error) {
    console.log("admin productMutations ERROR: ", error);
  }
};

export const productVariantsMutations = async ({
  request,
  productId,
  data,
}: {
  request: Request;
  productId: string;
  data: VariantDataType[];
}) => {
  const { admin } = await authenticate.admin(request);
  const variantsInput = data.map((variant) => {
    return {
      price: variant.price,
      optionValues: variant.optionValues,
    };
  });
  try {
    await admin.graphql(
      `#graphql
      mutation CreateProductVariants($productId: ID!, $variantsInput: [ProductVariantsBulkInput!]!) {
        productVariantsBulkCreate(productId: $productId, variants: $variantsInput) {
          productVariants {
            id
            title
            selectedOptions {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          productId: productId,
          variantsInput: variantsInput,
        },
      },
    );
  } catch (error) {
    console.log("admin productVariantsMutations ERROR: ", error);
  }
};
