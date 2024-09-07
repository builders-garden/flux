import { usePaymentLinksStore } from "@/lib/store";
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

export default function DeletePaymentLinkModal({
  isOpen,
  onOpenChange,
  onModalClose,
}: {
  onModalClose: () => void;
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
}) {
  const paymentLink = usePaymentLinksStore((state) => state.deletePaymentLink);
  const setDeletePaymentLink = usePaymentLinksStore(
    (state) => state.setDeletePaymentLink
  );
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState<boolean>(false);

  const deletePaymentLink = async (onClose: () => void) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();

      await fetch(`/api/payment-links/${paymentLink?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDeletePaymentLink(null);
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
              Delete Payment Link
            </ModalHeader>
            <ModalBody>
              <p>
                By clicking on <span className="font-bold">Confirm</span> you
                will delete the{" "}
                <span className="font-bold">{paymentLink?.name}</span> link.
                There's no going back
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
                onPress={() => deletePaymentLink(onClose)}
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
