export const PRODUCT_PURCHASE_ACTION_ID = (
  productId: string,
  paymentLinkId: string
) => `purchase-product-${productId}-link-${paymentLinkId}`;

export const PRODUCT_PURCHASE_ACTION_NAME = (productName: string) =>
  `Purchase Product ${productName}`;

export const PRODUCT_PURCHASE_ACTION_DESCRIPTION = (productName: string) =>
  `Verify that you didn't purchase ${productName} before`;

export const createNewIncognitoAction = async (
  productId: string,
  productName: string,
  paymentLinkId: string,
  maxVerifications: number
) => {
  const actionId = PRODUCT_PURCHASE_ACTION_ID(productId, paymentLinkId);
  const actionName = PRODUCT_PURCHASE_ACTION_NAME(productName);
  const actionDescription = PRODUCT_PURCHASE_ACTION_DESCRIPTION(productName);
  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/create-action/${process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.WORLDCOIN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: actionId,
        name: actionName,
        description: actionDescription,
        max_verifications: maxVerifications,
      }),
    }
  );
  const data = await response.json();
  return data;
};

export interface Proof {
  verification_level: string;
  nullifier_hash: string;
  credential_type?: string;
  proof: string;
  merkle_root: string;
}

export const verifyProof = async (proof: Proof, actionId: string) => {
  proof.credential_type = undefined;
  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/verify/${process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.WORLDCOIN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...proof,
        action: actionId,
      }),
    }
  );
  const data = await response.json();
  return data;
};
