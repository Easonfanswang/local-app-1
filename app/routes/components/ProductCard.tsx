import { BlockStack, Card, Image, Text } from "@shopify/polaris";

interface ProductCardProps {
  number: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ number }) => {
  return (
    <Card>
      <BlockStack gap="100">
        <Image alt="product image" source="" height={180} width={180}></Image>
        <Text as="h1" variant="headingSm" fontWeight="bold" truncate={true}>
          VICHYIE Women Mock Neck Ribbed Bodycon Dress Long Sleeve Mini Pencil
          Dresses
        </Text>
        <Text as="p" variant="bodyXs" truncate={true}>
          Contains total {number} variation(s)
        </Text>
      </BlockStack>
    </Card>
  );
};

export default ProductCard;
