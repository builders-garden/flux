const columns = [
  { name: "ID", uid: "id" },
  { name: "TX HASH", uid: "txHash" },
  { name: "AMOUNT", uid: "amount" },
  { name: "CREATION DATE", uid: "creationDate" },
  { name: "CUSTOMER", uid: "customer" },
];

const transactions = [
  {
    id: 1,
    txHash:
      "0x6516a58c83dbe796b9aef9879599afa251c95aed744061ea9211f7b9a69176e7",
    amount: "10.00",
    creationDate: "2021-10-01",
    customer: "orbulo.eth",
  },
];

export { columns, transactions };
