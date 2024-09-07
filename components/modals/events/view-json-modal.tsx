import { useJsonStore } from "@/lib/store";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function ViewJsonModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
}) {
  const json = useJsonStore((state) => state.json);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            {/* <ModalHeader className="flex flex-col gap-1">View JSON</ModalHeader> */}
            <ModalBody>
              <div className="bg-gray-300 rounded-lg p-2 max-h-[300px] overflow-y-scroll">
                <p>
                  <pre>{JSON.stringify(json, null, 2)}</pre>
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
