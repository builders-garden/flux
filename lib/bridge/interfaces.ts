export enum BridgeKycStatus {
  NOT_STARTED = "not_started",
  PENDING = "pending",
  INCOMPLETE = "incomplete",
  AWAITING_UBO = "awaiting_ubo",
  MANUAL_REVIEW = "manual_review",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum BridgeTosStatus {
  PENDING = "pending",
  APPROVED = "approved",
}

export interface BridgeKybLink {
  id: string;
  email: string;
  type: "business";
  kyc_link: string;
  tos_link: string;
  kyc_status: BridgeKycStatus;
  tos_status: BridgeTosStatus;
  created_at: string; // ISO 8601 date string
  customer_id?: string;
}

export interface BridgeExternalAccount {
  id: string;
  currency?: "usd" | "eur";
  bank_name?: string;
  account_owner_name: string;
  account_number?: string;
  routing_number?: string;
  account_type: "iban";
  iban?: {
    last_4?: string;
    account_number: string;
    bic: string;
    country: string;
  };
  account?: {
    account_number: string;
    routing_number: string;
    checking_or_savings?: string;
  };
  account_owner_type: "business";
  first_name?: string;
  last_name?: string;
  business_name?: string;
  address?: {
    street_line_1: string;
    street_line_2?: string;
    city: string;
    country: string;
    state?: string;
    postal_code?: string;
  };
}

export interface BridgeExternalAccountCamel {
  id: string;
  currency?: "usd" | "eur";
  bankName?: string;
  accountOwnerName: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType: "iban";
  iban?: {
    last_4?: string;
    accountNumber: string;
    bic: string;
    country: string;
  };
  account?: {
    accountNumber: string;
    routingNumber: string;
    checkingOrSavings?: string;
  };
  accountOwnerType: "business";
  firstName?: string;
  lastName?: string;
  businessName?: string;
  address?: {
    streetLine1: string;
    streetLine2?: string;
    city: string;
    country: string;
    state?: string;
    postalCode?: string;
  };
}
