import { BlockStack, Button, Card, Image, Text } from "@shopify/polaris";
import { ProductDataType } from "./ProductListCard";
import { Link, useFetcher } from "@remix-run/react";

interface ProductCardProps {
  productData: ProductDataType;
  onCardClick: (productData: ProductDataType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productData,
  onCardClick,
}) => {
  const fetcher = useFetcher<any>();
  const isLoading = fetcher.state !== "idle";

  const handleImport = () => {
    fetcher.submit(
      {
        productData: JSON.stringify(productData),
      },
      { method: "POST" },
    );
  };

  return (
    <Card>
      <BlockStack gap="100">
        <div
          onClick={() => onCardClick(productData)}
          style={{ cursor: "pointer" }}
        >
          <BlockStack gap="100">
            <div style={{
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Image
                alt="product image"
                source={productData.image?.[0] || ""}
                height="auto"
                width="auto"
                style={{
                  maxHeight: "180px",
                  maxWidth: "100%",
                  objectFit: "contain"
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
        {productData.shopifyUrl ? (
          <span
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <Link to={productData.shopifyUrl} target="_blank">
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
              loading={isLoading}
              disabled={isLoading}
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
