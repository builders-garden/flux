import { BridgeExternalAccount, BridgeKybLink } from "./interfaces";

if (!process.env.BRIDGE_API_KEY) {
  throw new Error("BRIDGE_API_KEY is not set");
}

const apiKey = process.env.BRIDGE_API_KEY;
const baseUrl = process.env.BRIDGE_API_BASE_URL || "http://localhost:3002";

const redirectUri = process.env.BRIDGE_REDIRECT_URI || "http://localhost:3000";

export const checkKYBStatus = async (
  kybLinkId: string
): Promise<BridgeKybLink> => {
  const url = new URL(`${baseUrl}/bridge/kyc-links/${kybLinkId}`);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data;
};

export const getKYCLink = async (
  fullName: string,
  email: string
): Promise<BridgeKybLink> => {
  const url = new URL(`${baseUrl}/bridge/kyc-links`);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      // TODO: replace with "business" value
      type: "individual",
      fullName,
      email,
      redirectUri,
    }),
  });
  const data = await response.json();
  return data;
};

export const getExternalAccount = async (
  customerId: string,
  externalAccountId: string
): Promise<BridgeExternalAccount> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/external-accounts/${externalAccountId}`
  );
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data;
};

export const createExternalAccount = async (
  customerId: string,
  data: {
    accountNumber: string;
    bic: string;
    country: string;
    address: {
      street: string;
      city: string;
      country: string;
      state?: string;
      postalCode: string;
    };
    accountOwnerName: {
      firstName?: string;
      lastName?: string;
      businessName?: string;
    };
    routingNumber?: string;
  }
): Promise<BridgeExternalAccount> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/external-accounts`
  );
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      ...data,
      // TODO: replace with "business" value later
      accountOwnerType: "individual",
      accountType: "iban",
    }),
  });
  const responseData = await response.json();
  return responseData;
};

export const deleteExternalAccount = async (
  customerId: string,
  externalAccountId: string
) => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/external-accounts/${externalAccountId}`
  );
  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data;
};

export const getCustomerDetails = async (customerId: string) => {
  const url = new URL(`${baseUrl}/bridge/customers/${customerId}`);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data;
};
