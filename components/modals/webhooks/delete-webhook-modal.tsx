import { useWebhooksStore } from "@/lib/store";
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

export default function DeleteWebhooModal({
  isOpen,
  onOpenChange,
  onModalClose,
}: {
  onModalClose: () => void;
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
}) {
  const webhook = useWebhooksStore((state) => state.deleteWebhook);
  const setDeleteWebhook = useWebhooksStore((state) => state.setDeleteWebhook);
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState<boolean>(false);

  const deleteWebhook = async (onClose: () => void) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();

      await fetch(`/api/webhooks/${webhook?.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDeleteWebhook(null);
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
              Delete webhook
            </ModalHeader>
            <ModalBody>
              <p>
                By clicking on <span className="font-bold">Confirm</span> you
                will delete the{" "}
                <span className="font-bold">{webhook?.name}</span> webhook.
                There&apos;s no going back.
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
                onPress={() => deleteWebhook(onClose)}
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
