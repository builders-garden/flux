import { Chip } from "@nextui-org/react";
import { CopyCheckIcon, CopyIcon } from "lucide-react";

export default function IdChip({ id }: { id: string }) {
  const copyId = () => {
    navigator.clipboard.writeText(id);
  };
  const shortId = id.slice(0, 4) + "..." + id.slice(-4);
  return (
    <div className="flex flex-row gap-2 items-center">
      <CopyIcon
        size={12}
        onClick={copyId}
        className="cursor-pointer hover:text-success-500"
      />
      <Chip size="sm" variant="bordered" color="primary" radius="sm">
        <div className="font-semibold">#{shortId}</div>
      </Chip>
    </div>
  );
}
