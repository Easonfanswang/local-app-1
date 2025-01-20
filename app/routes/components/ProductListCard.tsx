import {
  Card,
  Grid,
  Icon,
  Layout,
  Pagination,
  Select,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState, useMemo, useEffect } from "react";
import { SearchIcon } from "@shopify/polaris-icons";
import ProductCard from "./ProductCard";
import pkg from "lodash";
const { debounce } = pkg;
import { useFetcher } from "@remix-run/react";
import ProductDetailsModal from "./ProductDetailsModal";

export interface ProductDataType {
  id: number;
  title: string;
  number: number;
  descriptionHtml: string | undefined;
  image: string[] | undefined;
}

export interface pageInfoType {
  page: number;
  totalPage: number;
}

interface ProductListCardProps {}

const ProductListCard: React.FC<ProductListCardProps> = () => {
  const [productsData, setProductsData] = useState<ProductDataType[]>();
  const [pageInfo, setPageInfo] = useState<pageInfoType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState("1");
  const [currentPage, setCurrentPage] = useState<number>(pageInfo?.page || 1);
  const [action, setAction] = useState<boolean>(false);
  const fetcehr = useFetcher<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDataType | null>(null);

  useEffect(() => {
    setTimeout(() => {
      fetcehr.submit(
        {
          loading: JSON.stringify({
            loading: JSON.stringify({
              page: 1,
              searchValue: "",
              filter: "1",
            }),
          }),
        },
        { method: "POST" },
      );
    }, 3000);
  }, []);

  useEffect(() => {
    if (fetcehr.data) {
      shopify.toast.show("Loading completed");
      setProductsData(fetcehr.data.data);
      setPageInfo(fetcehr.data.pageInfo);
      console.log(fetcehr.data);
      setIsLoading(false);
      setAction(false);
    }
  }, [fetcehr.data]);

  // 使用防抖处理搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1); // 重置页码到第一页
      fetcehr.submit(
        {
          loading: JSON.stringify({
            page: 1,
            searchValue: value,
            filter: selected,
          }),
        },
        { method: "POST" },
      );
    }, 500),
    [selected],
  );

  // 处理搜索输入
  const handleSearchChange = useCallback(
    (newValue: string) => {
      setAction(true);
      setSearchValue(newValue);
      debouncedSearch(newValue);
    },
    [debouncedSearch],
  );

  // 处理筛选变化
  const handleSelectChange = useCallback(
    (value: string) => {
      setAction(true);
      setSelected(value);
      setCurrentPage(1);
      fetcehr.submit(
        {
          loading: JSON.stringify({
            page: 1,
            searchValue,
            filter: value,
          }),
        },
        { method: "POST" },
      );
    },
    [searchValue],
  );

  // 处理分页事件
  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setAction(true);
      setCurrentPage((prev) => prev - 1);
      fetcehr.submit(
        {
          loading: JSON.stringify({
            page: currentPage - 1,
            searchValue,
            filter: selected,
          }),
        },
        { method: "POST" },
      );
    }
  }, [currentPage, searchValue, selected]);

  const handleNextPage = useCallback(() => {
    setAction(true);
    setCurrentPage((prev) => prev + 1);
    fetcehr.submit(
      {
        loading: JSON.stringify({
          page: currentPage + 1,
          searchValue,
          filter: selected,
        }),
      },
      { method: "POST" },
    );
  }, [currentPage, searchValue, selected]);

  const handleCardClick = useCallback((productData: ProductDataType) => {
    setSelectedProduct(productData);
    setModalOpen(true);
  }, []);

  return (
    <div>
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
            {isLoading || action ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Spinner accessibilityLabel="Spinner example" size="large" />
              </div>
            ) : (
              <Grid>
                {productsData?.map((productData: ProductDataType) => (
                  <Grid.Cell
                    key={productData.id}
                    columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}
                  >
                    <ProductCard
                      productData={productData}
                      onCardClick={handleCardClick}
                    />
                  </Grid.Cell>
                ))}
              </Grid>
            )}
          </Layout.Section>
          <Layout.Section>
            <div
              style={{
                display: "flex",
                flexDirection: "column", // 改为纵向排列
                alignItems: "center", // 水平居中
                gap: "8px", // 添加间距
              }}
            >
              <Pagination
                label={
                  pageInfo &&
                  `Page ${currentPage} of ${pageInfo?.totalPage || 1}`
                }
                hasPrevious={currentPage > 1}
                onPrevious={handlePreviousPage}
                hasNext={pageInfo ? currentPage != pageInfo?.totalPage : false}
                onNext={handleNextPage}
              />
            </div>
          </Layout.Section>
        </Layout>
      </Card>
      <ProductDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

const options = [
  { label: "All", value: "1" },
  { label: "Imported to Shopify", value: "2" },
  { label: "Not Imported", value: "3" },
];

export default ProductListCard;
