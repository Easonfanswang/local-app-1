import { Modal } from "@shopify/polaris";
import { ProductDataType } from "./ProductListCard";

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
        <div style={{ display: "flex", gap: "20px" }}>
          {product.image && product.image[0] && (
            <img
              src={product.image[0]}
              alt={product.title}
              style={{ maxWidth: "200px", height: "auto" }}
            />
          )}
          <div>
            <p>Variations: {product.number}</p>
            {product.descriptionHtml && (
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
          </div>
        </div>
      </Modal.Section>
    </Modal>
  );
};

export default ProductDetailsModal;
