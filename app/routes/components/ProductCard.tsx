import { BlockStack, Card, Image, Text } from "@shopify/polaris";
import { ProductDataType } from "../app._index";

interface ProductCardProps {
  productData: ProductDataType;
}

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  return (
    <Card>
      <BlockStack gap="100">
        <Image
          alt="product image"
          source={productData.image?.[0] || ""}
          height={180}
          width={180}
        ></Image>
        <Text as="h1" variant="headingSm" fontWeight="bold" truncate={true}>
          {productData.title}
        </Text>
        <Text as="p" variant="bodyXs" truncate={true}>
          Contains total {productData.number} variation(s)
        </Text>
      </BlockStack>
    </Card>
  );
};

export default ProductCard;
