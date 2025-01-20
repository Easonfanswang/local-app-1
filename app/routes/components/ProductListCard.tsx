import {
  Card,
  Grid,
  Icon,
  Layout,
  Select,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState, useMemo } from "react";
import { SearchIcon } from "@shopify/polaris-icons";
import ProductCard from "./ProductCard";
import { ProductDataType } from "../app._index";

interface ProductListCardProps {
  loading: boolean;
  productsData: ProductDataType[] | undefined;
}

const ProductListCard: React.FC<ProductListCardProps> = ({
  loading,
  productsData,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState("1");

  const options = [
    { label: "All", value: "1" },
    { label: "Imported to Shopify", value: "2" },
    { label: "Not Imported", value: "3" },
  ];

  const handleSearchChange = useCallback(
    (newValue: string) => setSearchValue(newValue),
    [],
  );

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  // 过滤产品数据
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];
    return productsData.filter((product) =>
      product.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [productsData, searchValue]);

  return (
    <Card>
      <Layout>
        <Layout.Section>
          <Text as="h1" variant="headingSm" fontWeight="bold">
            Products fetched from Amazon
          </Text>
        </Layout.Section>
        <Layout.Section>
          <TextField
            label="Search Products"
            placeholder="Search products by title"
            value={searchValue}
            onChange={handleSearchChange}
            prefix={<Icon source={SearchIcon} tone="base" />}
            autoComplete="off"
          />
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Select
            label="Date range"
            options={options}
            onChange={handleSelectChange}
            value={selected}
          />
        </Layout.Section>
        <Layout.Section>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px", // 可以根据需要调整高度
              }}
            >
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
          ) : (
            <Grid>
              {filteredProducts.map((productData: ProductDataType) => (
                <Grid.Cell
                  key={productData.id}
                  columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}
                >
                  <ProductCard productData={productData} />
                </Grid.Cell>
              ))}
            </Grid>
          )}
        </Layout.Section>
      </Layout>
    </Card>
  );
};

export default ProductListCard;
