import { Modal, Text, Button, Icon } from "@shopify/polaris";
import { ChevronLeftIcon, ChevronRightIcon } from "@shopify/polaris-icons";
import { ProductDataType } from "./ProductListCard";
import { useState, useRef } from "react";
import "../../styles/ProductDetailsModal.css";

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductDataType | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  open,
  onClose,
  product,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

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

  if (!product) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product.title}
      titleHidden
      size="large"
      primaryAction={{
        content: "View on Shopify",
      }}
      secondaryActions={[
        {
          content: "Close",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <div className="modal-content">
          {/* 左侧图片区域 */}
          <div className="image-container">
            {/* 主图区域 */}
            <div
              style={{
                marginBottom: "20px",
                border: "1px solid #e6e6e6",
                borderRadius: "8px",
                padding: "10px",
                height: "480px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={product?.image?.[selectedIndex] || ""}
                alt={product?.title}
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
                {product?.image?.map((img, index) => (
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
                      alt={`${product?.title} - ${index + 1}`}
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
            <Text as="h2" variant="headingLg" fontWeight="bold">
              {product.title}
            </Text>
            {/* 这里可以添加更多产品信息 */}
          </div>
        </div>
      </Modal.Section>
    </Modal>
  );
};

export default ProductDetailsModal;
