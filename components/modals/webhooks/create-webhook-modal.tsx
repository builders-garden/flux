import { WEBHOOK_EVENTS } from "@/lib/constants";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { usePrivy } from "@privy-io/react-auth";
import { CodeSquareIcon, LinkIcon } from "lucide-react";
import { useState } from "react";

type Event = {
  id: string;
  name: string;
};

export default function CreateWebhookModal({
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
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState(new Set([]));
  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const createWebhook = async (onClose: () => void) => {
    setLoading(true);
    try {
      const event = selectedEvent.values().next().value;

      await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify({
          name,
          url: webhookUrl,
          eventType: event,
        }),
      });

      setName("");
      setSelectedEvent(new Set([]));
      setWebhookUrl("");

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
              Create Webhook
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                endContent={
                  <CodeSquareIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Name"
                placeholder="Enter a name.."
                variant="bordered"
                isRequired
                value={name}
                onValueChange={setName}
              />
              <Input
                endContent={
                  <LinkIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Webhook URL"
                placeholder="https://yourdomain.com/webhook"
                variant="bordered"
                value={webhookUrl}
                onValueChange={setWebhookUrl}
                isRequired
              />
              <Select
                items={WEBHOOK_EVENTS}
                // label="Assigned to"
                variant="bordered"
                placeholder="Select an event"
                labelPlacement="outside"
                selectedKeys={selectedEvent}
                // @ts-expect-error - Ignore this
                onSelectionChange={setSelectedEvent}
                isRequired
              >
                {(event: Event) => (
                  <SelectItem key={event.id} textValue={event.name}>
                    <div className="flex gap-2 items-center">
                      <span className="text-small">{event.name}</span>
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
                  !name || selectedEvent.size === 0 || !webhookUrl || loading
                }
                isLoading={loading}
                color="primary"
                onPress={() => createWebhook(onClose)}
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
