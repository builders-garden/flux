import FileUploadButton from "@/components/file-upload-button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  SelectItem,
  Select,
} from "@nextui-org/react";
import { PaymentMethod } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import {
  CircleDollarSignIcon,
  PackageIcon,
  TextIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useState } from "react";

type Method = {
  id: PaymentMethod;
  name: string;
};

export default function CreateProductModal({
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("0");
  const [selectedMethod, setSelectedMethod] = useState(new Set([]));

  const createProduct = async (onClose: () => void) => {
    setLoading(true);
    try {
      const method = selectedMethod.values().next().value;

      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", productPrice);
      formData.append("paymentMethod", method);
      if (imageFile) {
        formData.append("files[0]", imageFile);
      }

      await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: formData,
      });

      setProductName("");
      setProductDescription("");
      setProductPrice("0");
      setImageFile(null);

      onClose();
      onModalClose();
    } catch (error) {
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
              Create Product
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
                  <PackageIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
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

              <Select
                items={[
                  {
                    id: PaymentMethod.ONE_TIME,
                    name: "One time payment",
                  },
                  {
                    id: PaymentMethod.RECURRING,
                    name: "Each month",
                  },
                ]}
                // label="Assigned to"
                variant="bordered"
                placeholder="Select payment type"
                labelPlacement="outside"
                selectedKeys={selectedMethod}
                // @ts-expect-error - Ignore this
                onSelectionChange={setSelectedMethod}
                isRequired
              >
                {(method: Method) => (
                  <SelectItem key={method.id} textValue={method.name}>
                    <div className="flex gap-2 items-center">
                      <span className="text-small">{method.name}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
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
                  !selectedMethod ||
                  loading
                }
                isLoading={loading}
                color="primary"
                onPress={() => createProduct(onClose)}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
