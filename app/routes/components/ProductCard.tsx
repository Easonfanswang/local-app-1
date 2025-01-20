import { BlockStack, Card, Image, Text } from "@shopify/polaris";
import { ProductDataType } from "./ProductListCard";

interface ProductCardProps {
  productData: ProductDataType;
  onCardClick: (productData: ProductDataType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productData,
  onCardClick,
}) => {
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
      </BlockStack>
    </Card>
  );
};

export default ProductCard;
