import { BlockStack, Button, Card, Image, Text } from "@shopify/polaris";
import { ProductDataType } from "./ProductListCard";
import {
  Link,
  useFetcher,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";

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
  const navigation = useNavigation();
  const [isImporting, setIsImporting] = useState(false);
  const [shopifyUrl, setShopifyUrl] = useState<string>(productData.shopifyUrl);

  const handleImport = async () => {
    setIsImporting(true);
    fetcher.submit(
      {
        productData: JSON.stringify(productData),
      },
      { method: "POST" },
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setIsImporting(false);
      const shopName = shop.split(".")[0];
      const url = `https://admin.shopify.com/store/${shopName}/products/${fetcher.data.id}`;
      setShopifyUrl(url);
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
                source={productData.image?.[0] || ""}
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
        {shopifyUrl ? (
          <span
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <Link to={shopifyUrl} target="_blank">
              <Image
                alt="shopifyIcon"
                source="/shopify.svg"
                width={30}
                height="auto"
              />
            </Link>
            <Link to={productData.amazonUrl} target="_blank">
              <Image
                alt="amazonIcon"
                source="/amazon.svg"
                width={30}
                height="auto"
              />
            </Link>
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            <Button
              variant="primary"
              onClick={handleImport}
              loading={isImporting}
              disabled={isImporting}
            >
              Import to Shopify
            </Button>
            <Link to={productData.amazonUrl} target="_blank">
              <Image
                alt="amazonIcon"
                source="/amazon.svg"
                width={30}
                height="auto"
              />
            </Link>
          </span>
        )}
      </BlockStack>
    </Card>
  );
};

export default ProductCard;
