export type NewTransactionPayload = {
  data: {
    userId: string;
    productId: string;
    hash: string;
    amount: number;
    fromAddress: string;
    timestamp: Date;
  };
};
