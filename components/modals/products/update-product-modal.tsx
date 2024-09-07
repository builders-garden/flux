import FileUploadButton from "@/components/file-upload-button";
import { useProductsStore } from "@/lib/store";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { usePrivy } from "@privy-io/react-auth";
import {
  BoxIcon,
  CircleDollarSignIcon,
  TextIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function UpdateProductModal({
  isOpen,
  onOpenChange,
  onOpen,
  onModalClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
  onModalClose: () => void;
}) {
  const { getAccessToken } = usePrivy();
  const product = useProductsStore((state) => state.updateProduct);
  const setUpdateProduct = useProductsStore((state) => state.setUpdateProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>(product?.name || "");
  const [productDescription, setProductDescription] = useState<string>(
    product?.description || ""
  );
  const [productPrice, setProductPrice] = useState<string>(
    product?.price.toString() || "0"
  );

  const updateProduct = async (onClose: () => void) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", productPrice);
      if (imageFile) {
        formData.append("files[0]", imageFile);
      }

      await fetch(`/api/products/${product?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: formData,
      });

      setProductName("");
      setProductDescription("");
      setProductPrice("0");
      setImageFile(null);
      setUpdateProduct(null);

      onClose();
      onModalClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(product.price.toString());
    }
  }, [product]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Product
            </ModalHeader>
            <ModalBody>
              <FileUploadButton
                accept="image/*"
                startContent={<UploadCloudIcon />}
                rejectProps={{
                  color: "danger",
                  startContent: <UploadCloudIcon />,
                }}
                color="primary"
                onUpload={(files) => {
                  setImageFile(files[0]);
                }}
                className="w-full"
              >
                {imageFile ? imageFile.name : "Upload image"}
              </FileUploadButton>
              <Input
                autoFocus
                endContent={
                  <BoxIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Name"
                placeholder="Awesome sneakers"
                variant="bordered"
                isRequired
                value={productName}
                onValueChange={setProductName}
              />
              <Input
                endContent={
                  <TextIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Description"
                placeholder="These sneakers are the best ones for running."
                variant="bordered"
                isRequired
                value={productDescription}
                onValueChange={setProductDescription}
              />
              <Input
                endContent={
                  <CircleDollarSignIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Price (USD)"
                placeholder="0"
                type="number"
                min={0}
                variant="bordered"
                isRequired
                value={productPrice}
                onValueChange={setProductPrice}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                isDisabled={
                  !productName ||
                  !productDescription ||
                  !productPrice ||
                  loading
                }
                isLoading={loading}
                color="primary"
                onPress={() => updateProduct(onClose)}
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
