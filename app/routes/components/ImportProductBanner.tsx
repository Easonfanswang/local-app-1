import {
  Banner,
  TextField,
  Button,
  BlockStack,
  InlineError,
} from "@shopify/polaris";
import { useCallback, useState } from "react";

interface ImportProductBannerProps {}

const ImportProductBanner: React.FC<ImportProductBannerProps> = () => {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );

  const isValueInvalid = (content: string) => {
    // 检查是否为空
    if (!content?.trim()) {
      return false;
    }

    try {
      // 尝试解析 URL
      const url = new URL(content);

      // 检查是否是 Amazon 域名
      if (!url.hostname.includes("amazon.com")) {
        return true;
      }

      // 检查是否包含商品 ID (ASIN)
      const pathSegments = url.pathname.split("/");
      const dpIndex = pathSegments.indexOf("dp");

      // 验证 dp 后面的 ASIN 格式（10位字母数字组合）
      if (
        dpIndex === -1 ||
        !pathSegments[dpIndex + 1]?.match(/^[A-Z0-9]{10}$/)
      ) {
        return true;
      }

      return false;
    } catch (error) {
      // URL 格式无效
      return true;
    }
  };

  const textFieldID = 'ruleContent';
  const isInvalid = isValueInvalid(value);
  const errorMessage = isInvalid
    ? "Invalid Amazon product URL"
    : "";

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
          error={isInvalid}
          id={textFieldID}
        />
        <div style={{ marginTop: "4px" }}>
          <InlineError message={errorMessage} fieldID={textFieldID} />
        </div>
        <Button variant="primary">Import Product</Button>
      </BlockStack>
    </Banner>
  );
};

export default ImportProductBanner;
