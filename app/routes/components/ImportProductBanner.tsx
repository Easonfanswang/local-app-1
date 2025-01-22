import { Banner, TextField, Button, BlockStack } from "@shopify/polaris";
import { useCallback, useState } from "react";

interface ImportProductBannerProps {}

const ImportProductBanner: React.FC<ImportProductBannerProps> = () => {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );

  return (
    <Banner title="Import product from Amazon" hideIcon={true}>
      <BlockStack gap="100">
        <TextField
          label="Product URL"
          placeholder="https://www.amazon.com/dp/B07V7YQV6S"
          value={value}
          onChange={handleChange}
          multiline={3}
          autoComplete="off"
        />
        <Button variant="primary" >Import Product</Button>
      </BlockStack>
    </Banner>
  );
};

export default ImportProductBanner;
