import { useProductsStore } from "@/lib/store";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function DeleteProductModal({
  isOpen,
  onOpenChange,
  onModalClose,
}: {
  onModalClose: () => void;
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
}) {
  const product = useProductsStore((state) => state.deleteProduct);
  const setDeleteProduct = useProductsStore((state) => state.setDeleteProduct);
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState<boolean>(false);

  const deleteProduct = async (onClose: () => void) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();

      await fetch(`/api/products/${product?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDeleteProduct(null);
      onClose();
      onModalClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete product
            </ModalHeader>
            <ModalBody>
              <p>
                By clicking on <span className="font-bold">Confirm</span> you
                will delete the{" "}
                <span className="font-bold">{product?.name}</span> product.
                There&apos;s no going back. You will lose all resources
                associated with this product.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                isDisabled={loading}
                isLoading={loading}
                color="primary"
                onPress={() => deleteProduct(onClose)}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
