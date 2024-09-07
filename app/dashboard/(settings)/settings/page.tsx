"use client";

import { useUserStore } from "@/lib/store";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { usePrivy } from "@privy-io/react-auth";
import {
  AlertTriangleIcon,
  CreditCardIcon,
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
      {!currentUser?.companyName && (
        <Card>
          <CardBody className="bg-amber-500 flex flex-row space-x-2 text-amber-900 items-center">
            <AlertTriangleIcon />
            <p className="text-sm">
              You need to provide your full name, company name and URL, and the
              KYB documents in order to receive payments from Flux.
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
