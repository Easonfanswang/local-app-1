import {
  ProductDataType,
  VariantDataType,
} from "app/routes/components/ProductListCard";
import { authenticate } from "app/shopify.server";
import { storeProductId } from "app/api/mock";
import { convertDescriptionToHtml } from "app/routes/app._index";

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
  let productId;
  let productOptions;
  if (data?.productOptions) {
    productOptions = convertOptionsFormat(data?.productOptions);
  }
  const descriptionHtml = convertDescriptionToHtml(data?.description);

  if (data.images) {
    let productMediaInput;

    const productImages = data.images.map((url) => {
      return {
        alt: "",
        mediaContentType: "IMAGE",
        originalSource: url,
      };
    });

    const variantImages = data.variants.map((variant) => {
      return {
        alt: "",
        mediaContentType: "IMAGE",
        originalSource: variant.image,
      };
    });

    productMediaInput = [...productImages, ...variantImages];

    try {
      // 创建产品
      const response = await admin.graphql(
        `#graphql
        mutation createProductMetafields($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
          productCreate(product: $product, media: $media) {
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
              media(first: 250) {
                edges {
                  node {
                    alt
                    ... on MediaImage {
                      id
                    }
                  }
                }
              }
              variants(first: 1) {
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
            media: productMediaInput,
            product: {
              title: data.title,
              descriptionHtml: descriptionHtml || "",
              productOptions: productOptions,
            },
          },
        },
      );

      const res = await response.json();
      productId = res.data.productCreate.product.id;
      const firstVariantId =
        res.data.productCreate.product.variants.edges[0].node.id;
      const media = res.data.productCreate.product?.media.edges;
      const length = data.images.length;
      // 并行执行变体创建和模拟存储
      await Promise.all([
        productVariantsMutations({
          request,
          productId,
          firstVariantId,
          data: data.variants,
          media: media,
          length: length,
        }),
        storeProductId(productId),
      ]);
    } catch (error) {
      console.log("admin productMutations ERROR: ", error);
      throw error;
    }
  } else {
    try {
      // 创建产品
      const response = await admin.graphql(
        `#graphql
        mutation createProductMetafields($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
          productCreate(product: $product, media: $media) {
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
              variants(first: 1) {
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
              descriptionHtml: descriptionHtml || "",
              productOptions: productOptions,
            },
          },
        },
      );

      const res = await response.json();
      productId = res.data.productCreate.product.id;
      const firstVariantId =
        res.data.productCreate.product.variants.edges[0].node.id;
      // 并行执行变体创建和模拟存储
      await Promise.all([
        productVariantsMutations({
          request,
          productId,
          firstVariantId,
          data: data.variants,
        }),
        storeProductId(productId),
      ]);
    } catch (error) {
      console.log("admin productMutations ERROR: ", error);
      throw error;
    }
  }
  const match = productId.match(/\/([^/]+)$/);
  if (match && match[1]) {
    return {
      success: true,
      id: match[1],
    };
  } else {
    return {
      warn: "The productId format is incorrect",
      id: productId,
    };
  }
};

export const productVariantsMutations = async ({
  request,
  productId,
  firstVariantId,
  data,
  media,
  length,
}: {
  request: Request;
  productId: string;
  firstVariantId: string;
  data: VariantDataType[];
  media?: any;
  length?: number;
}) => {
  const { admin } = await authenticate.admin(request);
  const mediaIdArray = media.slice(length).map((item: any) => item.node.id);
  const firstVariantsInput = [
    {
      id: firstVariantId,
      price: data[0].price.amount,
      mediaId: mediaIdArray[0],
    },
  ];
  const remainVariantsInput = data.slice(1).map((variant, index) => {
    return {
      price: variant.price.amount,
      optionValues: variant.optionValues,
      mediaId: mediaIdArray.slice(1)[index],
    };
  });
  try {
    const response = await admin.graphql(
      `#graphql
      mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
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
          variants: firstVariantsInput,
        },
      },
    );
    const res = await response.json();
    console.log(res.data);
    console.log(res.data.productVariantsBulkUpdate);
  } catch (error) {
    console.log("admin productVariantsMutations ERROR: ", error);
  }
  if (data.length > 1) {
    try {
      const response = await admin.graphql(
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
            variantsInput: remainVariantsInput,
          },
        },
      );
      const res = await response.json();
    } catch (error) {
      console.log("admin productVariantsMutations ERROR: ", error);
    }
  }
};
