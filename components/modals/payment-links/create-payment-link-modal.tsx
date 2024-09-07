import { useProducts } from "@/hooks";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Select,
  Avatar,
  SelectItem,
} from "@nextui-org/react";
import { Product } from "@prisma/client";
import { usePrivy } from "@privy-io/react-auth";
import { LinkIcon, PackageIcon } from "lucide-react";
import { useState } from "react";

export default function CreatePaymentLinkModal({
  isOpen,
  onOpenChange,

  onModalClose,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
  onModalClose: () => void;
}) {
  const { getAccessToken } = usePrivy();
  const { products } = useProducts();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [requiresWorldId, setRequiresWorldId] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(new Set([]));
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  const createPaymentLink = async (onClose: () => void) => {
    setLoading(true);
    try {
      const productId = (selectedProduct as Set<any>).values().next().value;

      await fetch("/api/payment-links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
          name,
          requiresWorldId,
          productId,
          redirectUrl,
        }),
      });

      setName("");
      setRequiresWorldId(false);
      setSelectedProduct(new Set([]));
      setRedirectUrl("");

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
              Create Payment Link
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                endContent={
                  <PackageIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Name"
                placeholder="Enter a name.."
                variant="bordered"
                isRequired
                value={name}
                onValueChange={setName}
              />
              {products && (
                <Select
                  items={products}
                  // label="Assigned to"
                  variant="bordered"
                  placeholder="Select a product"
                  labelPlacement="outside"
                  selectedKeys={selectedProduct}
                  onSelectionChange={setSelectedProduct}
                  isRequired
                >
                  {(product: Product) => (
                    <SelectItem key={product.id} textValue={product.name}>
                      <div className="flex gap-2 items-center">
                        {product.imageUrl ? (
                          <Avatar
                            alt={product.name}
                            className="flex-shrink-0"
                            size="sm"
                            src={product.imageUrl}
                          />
                        ) : (
                          <Avatar
                            size="md"
                            radius="sm"
                            icon={<PackageIcon color="grey" />}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-small">{product.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              )}
              <Input
                endContent={
                  <LinkIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Redirect URL"
                placeholder="https://yourdomain.com/redirect"
                variant="bordered"
                value={redirectUrl}
                onValueChange={setRedirectUrl}
                isRequired
              />
              <Checkbox
                defaultSelected
                isSelected={requiresWorldId}
                onValueChange={(value) => setRequiresWorldId(value)}
              >
                <p className="text-sm">
                  Requires <span className="font-bold">World ID</span>
                </p>
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                isDisabled={
                  !name || !selectedProduct || !redirectUrl || loading
                }
                isLoading={loading}
                color="primary"
                onPress={() => createPaymentLink(onClose)}
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
