"use client";

import { useUserStore } from "@/lib/store";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { usePrivy } from "@privy-io/react-auth";
import {
  AlertTriangleIcon,
  BanknoteIcon,
  CreditCardIcon,
  FileDigitIcon,
  FlagIcon,
  MailIcon,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { getAccessToken } = usePrivy();
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>(
    currentUser?.companyName || ""
  );
  const [companyUrl, setCompanyUrl] = useState<string>(
    currentUser?.companyUrl || ""
  );
  const [fullName, setFullName] = useState<string>(currentUser?.fullName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>(
    currentUser?.bankAccountNumber || ""
  );
  const [bankAccountBic, setBankAccountBic] = useState<string>(
    currentUser?.bankAccountBic || ""
  );
  const [bankAccountCountry, setBankAccountCountry] = useState<string>(
    currentUser?.bankAccountCountry || ""
  );

  useEffect(() => {
    if (currentUser) {
      setCompanyName(currentUser.companyName || "");
      setCompanyUrl(currentUser.companyUrl || "");
      setFullName(currentUser.fullName || "");
    }
  }, [currentUser]);
  const updateUser = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      let updatedUser = currentUser;

      const formData = new FormData();
      if (companyName) {
        formData.append("companyName", companyName);
        updatedUser = { ...updatedUser, companyName };
      }
      if (fullName) {
        formData.append("fullName", fullName);
        updatedUser = { ...updatedUser, fullName };
      }
      if (companyUrl) {
        formData.append("companyUrl", companyUrl);
        updatedUser = { ...updatedUser, companyUrl };
      }

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: formData,
      });

      if (response.ok) {
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      {(!currentUser?.companyName ||
        !currentUser?.companyUrl ||
        !currentUser?.bankAccountBic ||
        !currentUser.bankAccountCountry ||
        !currentUser.bankAccountNumber) && (
        <Card>
          <CardBody className="bg-amber-500 flex flex-row space-x-2 text-amber-900 items-center">
            <AlertTriangleIcon />
            <p className="text-sm">
              You need to provide your full name, company name and URL, and the
              bank data in order to receive off-ramp payments from Flux.
            </p>
          </CardBody>
        </Card>
      )}
      <div className="grid grid-cols-4 gap-4">
        <Input
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Email"
          variant="bordered"
          isDisabled
          value={currentUser?.email}
          className="col-span-2"
        />
        <Input
          endContent={
            <CreditCardIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Address"
          variant="bordered"
          isDisabled
          value={currentUser?.address}
          className="col-span-2"
        />
        <Input
          endContent={
            <User2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Full Name"
          variant="bordered"
          placeholder="Vitalik Buterin"
          className="col-span-1"
          value={fullName}
          onValueChange={setFullName}
          isRequired
        />
        <Input
          endContent={
            <User2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Company Name"
          variant="bordered"
          placeholder="Ethereum"
          className="col-span-1"
          value={companyName}
          onValueChange={setCompanyName}
          isRequired
        />
        <Input
          endContent={
            <User2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Company URL"
          variant="bordered"
          placeholder="https://ethereum.org"
          className="col-span-2"
          value={companyUrl}
          onValueChange={setCompanyUrl}
          isRequired
        />
        <Input
          endContent={
            <BanknoteIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Bank Account Number"
          variant="bordered"
          placeholder="IT 1234 1234 1234 1234"
          className="col-span-2"
          value={bankAccountNumber}
          onValueChange={setBankAccountNumber}
          isRequired
        />
        <Input
          endContent={
            <FileDigitIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Bank Account BIC"
          variant="bordered"
          placeholder="REVOLT21"
          className="col-span-1"
          value={bankAccountBic}
          onValueChange={setBankAccountBic}
          isRequired
        />
        <Input
          endContent={
            <FlagIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Bank Account Country"
          variant="bordered"
          placeholder="Italy"
          className="col-span-1"
          value={bankAccountCountry}
          onValueChange={setBankAccountCountry}
          isRequired
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="primary"
          onClick={() => updateUser()}
          isLoading={loading}
          isDisabled={loading}
        >
          Save Changes
        </Button>
      </div>
    </section>
  );
}
