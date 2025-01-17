import {
  Card,
  Grid,
  Icon,
  Layout,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { SearchIcon } from "@shopify/polaris-icons";
import ProductCard from "./ProductCard";
import React from "react";

interface ProductListCardProps {}

const ProductListCard: React.FC<ProductListCardProps> = () => {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState("1");

  const options = [
    { label: "All", value: "1" },
    { label: "Imported to Shopify", value: "2" },
    { label: "Not Imported", value: "3" },
  ];

  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

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
            label="Product URL"
            placeholder="search products by title"
            value={value}
            onChange={handleChange}
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
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <ProductCard number={45} />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <ProductCard number={12} />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <ProductCard number={23} />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <ProductCard number={4} />
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Card>
  );
};

export default ProductListCard;
