import { Modal, Text, Icon, Tabs, Image, IndexTable } from "@shopify/polaris";
import { ChevronLeftIcon, ChevronRightIcon } from "@shopify/polaris-icons";
import { ProductDataType } from "./ProductListCard";
import { useState, useRef, useCallback, useEffect } from "react";
import "../../styles/ProductDetailsModal.css";
import { useFetcher } from "@remix-run/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProductById,
  updateData,
} from "app/store/modules/productImportState";

interface ProductDetailsModalProps {
  shop: string;
  open: boolean;
  onClose: () => void;
  productData: ProductDataType | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  shop,
  open,
  onClose,
  productData,
}) => {
  if (!productData) return null;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher<any>();
  const dispatch = useDispatch();
  const state = useSelector((state: any) =>
    selectProductById(state, productData.id),
  );

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      const shopName = shop.split(".")[0];
      const url = `https://admin.shopify.com/store/${shopName}/products/${fetcher.data.id}`;
      dispatch(
        updateData({
          id: productData.id,
          loading: true,
          shopifyUrl: url,
        }),
      );
      console.log(fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);

  // 处理滚动
  const handleScroll = (direction: "left" | "right") => {
    if (!thumbnailsRef.current) return;

    const scrollAmount = 200; // 每次滚动的距离
    const newScrollLeft =
      direction === "left"
        ? thumbnailsRef.current.scrollLeft - scrollAmount
        : thumbnailsRef.current.scrollLeft + scrollAmount;

    thumbnailsRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    [],
  );

  const handleImport = async ({ id }: { id: string }) => {
    dispatch(
      updateData({
        id: id,
        loading: true,
      }),
    );
    fetcher.submit(
      {
        productData: JSON.stringify(productData),
      },
      { method: "POST" },
    );
  };

  const tabs = [
    {
      id: "product-detail",
      content: "Product Detail",
      panelID: "product-detail-1",
    },
    {
      id: "description",
      content: "Description",
      panelID: "description-2",
    },
    {
      id: "images",
      content: "Images",
      panelID: "images-3",
    },
    {
      id: "variations",
      content: "Variations",
      badge: productData?.variants?.length?.toString() || "0",
      panelID: "variations-4",
    },
  ];

  // 渲染不同的 tab 内容
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0: // Product Detail
        return (
          <div className="modal-content">
            {/* 左侧图片区域 */}
            <div className="image-container">
              {/* 主图区域 */}
              <div
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  height: "480px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={productData?.images?.[selectedIndex] || ""}
                  alt={productData?.title}
                  className="main-image"
                  width="100%"
                  height="auto"
                />
              </div>

              {/* 缩略图区域容器 */}
              <div className="thumbnail-scrolling">
                {/* 仅在PC端显示箭头 */}
                {window.innerWidth >= 768 && (
                  <>
                    {/* 左箭头 */}
                    <button
                      onClick={() => handleScroll("left")}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        border: "none",
                        background: "white",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Icon source={ChevronLeftIcon} tone="base" />
                    </button>

                    {/* 右箭头 */}
                    <button
                      onClick={() => handleScroll("right")}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                        border: "none",
                        background: "white",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Icon source={ChevronRightIcon} tone="base" />
                    </button>
                  </>
                )}

                {/* 缩略图滚动容器 */}
                <div ref={thumbnailsRef} className="hide-scrollbar">
                  {productData?.images?.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className="thumbnail"
                      style={{
                        border:
                          selectedIndex === index
                            ? "2px solid #008060"
                            : "1px solid #e6e6e6",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${productData?.title} - ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧信息区域 */}
            <div className="info-container">
              {/* 标题 */}
              <Text as="h2" variant="headingLg" fontWeight="bold">
                {productData?.title}
              </Text>

              {/* 价格区域 */}
              <div style={{ marginTop: "20px" }}>
                {(() => {
                  // 获取所有变体价格
                  const prices =
                    productData?.variants?.map((v) =>
                      parseFloat(v.price.amount.toString()),
                    ) || [];
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);

                  return (
                    <Text as="h3" variant="headingMd" fontWeight="semibold">
                      {minPrice === maxPrice
                        ? `${productData?.variants?.[0]?.price?.currencyCode} ${minPrice.toFixed(2)}`
                        : `${productData?.variants?.[0]?.price?.currencyCode} ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`}
                    </Text>
                  );
                })()}
              </div>

              {/* 变体选项信息 */}
              <div style={{ marginTop: "20px" }}>
                {productData?.productOptions &&
                  Object.entries(productData.productOptions).map(
                    ([optionName, values]) => (
                      <div key={optionName} style={{ marginBottom: "16px" }}>
                        <Text as="p" variant="bodyMd" fontWeight="bold">
                          {optionName}:
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginTop: "8px",
                          }}
                        >
                          {values.map((value) => (
                            <span
                              key={value}
                              style={{
                                padding: "6px 12px",
                                border: "1px solid #e1e3e5",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "default",
                              }}
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>
        );

      case 1: // Description
        return (
          <div className="modal-main-content">
            <div
              dangerouslySetInnerHTML={{
                __html: productData?.descriptionHtml || "",
              }}
            />
          </div>
        );

      case 2: // Images
        return (
          <div className="images-grid">
            {productData?.images?.map((img, index) => (
              <div key={index} className="image-item">
                <img
                  src={img}
                  alt={`${productData?.title} - ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        );

      case 3: // Variations
        const rowMarkup = productData?.variants.map(
          ({ id, image, optionValues, price }, index) => (
            <IndexTable.Row id={id} key={id} position={index}>
              <IndexTable.Cell>
                <Image alt="" source={image} width={60} height={60}></Image>
              </IndexTable.Cell>
              <IndexTable.Cell>
                {optionValues.map((optionValue) => {
                  return (
                    <div>
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                        {optionValue.optionName}
                        {": "}
                      </Text>
                      <Text variant="bodyMd" as="span">
                        {optionValue.name}
                      </Text>
                    </div>
                  );
                })}
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                  {price.currencyCode}{" "}
                </Text>
                <Text variant="bodyMd" as="span">
                  {price.amount}
                </Text>
              </IndexTable.Cell>
            </IndexTable.Row>
          ),
        );
        return (
          <div className="modal-main-content">
            <IndexTable
              headings={[
                { title: "Image" },
                { title: "Options" },
                { title: "Product Price" },
              ]}
              itemCount={productData?.variants.length || 0}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={productData.title}
      titleHidden
      size="large"
      primaryAction={
        state?.shopifyUrl
          ? {
              content: "View on Shopify",
              url: productData.shopifyUrl,
              target: "_blank",
            }
          : {
              content: "Import to Shopify",
              onAction: () => handleImport({ id: productData.id }),
              loading: state?.loading,
              disabled: state?.loading,
            }
      }
      secondaryActions={[
        {
          content: "Close",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {renderTabContent()}
        </Tabs>
      </Modal.Section>
    </Modal>
  );
};

export default ProductDetailsModal;
