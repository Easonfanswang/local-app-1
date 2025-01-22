import {
  BlockStack,
  Button,
  Card,
  Image,
  Text,
  Tooltip,
  UnstyledLink,
} from "@shopify/polaris";
import { ProductDataType } from "./ProductListCard";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "app/store/modules/productImportState";

interface ProductCardProps {
  shop: string;
  productData: ProductDataType;
  onCardClick: (productData: ProductDataType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  shop,
  productData,
  onCardClick,
}) => {
  const fetcher = useFetcher<any>();
  // const actionData = useActionData<any>();
  const dispatch = useDispatch();
  const state = useSelector((state: any) =>
    state.productImportState.rows.find(
      (item: any) => item.id === productData.id,
    ),
  );

  const handleImport = async ({ id }: { id: string }) => {
    dispatch(
      updateData({
        id: productData.id,
        loading: true,
      }),
    );
    fetcher.submit(
      {
        productData: JSON.stringify(productData),
      },
      { method: "POST" },
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      const shopName = shop.split(".")[0];
      const url = `https://admin.shopify.com/store/${shopName}/products/${fetcher.data.id}`;
      dispatch(
        updateData({
          id: productData.id,
          loading: false,
          shopifyUrl: url,
        }),
      );
      console.log(fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);

  // useEffect(() => {
  //   if (!isLoading && actionData?.success) {
  //     // webhook 处理完成，更新UI
  //     // 可以在这里更新状态或执行其他操作
  //   }
  // }, [isLoading, actionData]);

  return (
    <Card>
      <BlockStack gap="100">
        <div
          onClick={() => onCardClick(productData)}
          style={{ cursor: "pointer" }}
        >
          <BlockStack gap="100">
            <div
              style={{
                height: "180px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                alt="product image"
                source={productData.images?.[0] || ""}
                height="auto"
                width="auto"
                style={{
                  maxHeight: "180px",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <Text as="h1" variant="headingSm" fontWeight="bold" truncate={true}>
              {productData.title}
            </Text>
          </BlockStack>
        </div>
        <Text as="p" variant="bodyXs" truncate={true}>
          Contains total {productData.number} variation(s)
        </Text>

        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <div>
            {state?.shopifyUrl ? (
              <UnstyledLink to={state.shopifyUrl} target="_blank">
                <Tooltip
                  dismissOnMouseOut
                  content="View on Shopify"
                  preferredPosition="above"
                >
                  <Image
                    alt="shopifyIcon"
                    source="/shopify.svg"
                    width={30}
                    height="auto"
                  />
                </Tooltip>
              </UnstyledLink>
            ) : (
              <Button
                variant="primary"
                onClick={() => handleImport({ id: productData.id })}
                loading={state?.loading}
                disabled={state?.loading}
              >
                Import to Shopify
              </Button>
            )}
          </div>

          <UnstyledLink
            to={productData.amazonUrl}
            target="_blank"
            className="Polaris-Link"
          >
            <Tooltip dismissOnMouseOut content="View on Amazon">
              <Image
                alt="amazonIcon"
                source="/amazon.svg"
                width={30}
                height="auto"
              />
            </Tooltip>
          </UnstyledLink>
        </span>
      </BlockStack>
    </Card>
  );
};

export default ProductCard;
