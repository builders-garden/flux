const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "ENS", uid: "ens", sortable: true },
  { name: "CREATION DATE", uid: "creationDate", sortable: true },
  { name: "# TRANSACTIONS", uid: "numTransactions", sortable: true },
];

const users = [
  {
    id: 1,
    address: "0xA9bC8A58B39935BA3D8D1Ce4b0d3383153F184E1",
    creationDate: "2021-10-01",
    numTransactions: 10,
    ens: "orbulo.eth",
  },
  {
    id: 2,
    address: "0xB1b0EfABDDEDe4Dd183f14b08C6E142B5f435f82",
    creationDate: "2023-06-22",
    numTransactions: 7,
    ens: "",
  },
];

export { columns, users };
