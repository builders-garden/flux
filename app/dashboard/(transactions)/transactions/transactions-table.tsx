"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Avatar,
} from "@nextui-org/react";
import { columns } from "./data";
import {
  ExternalLinkIcon,
  LinkIcon,
  PackageIcon,
  SearchIcon,
} from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import { TransactionWithData } from "@/hooks";
import Link from "next/link";

const INITIAL_VISIBLE_COLUMNS = [
  "hash",
  "amount",
  "createdAt",
  "customer",
  "product",
];

export default function TransactionsTable({
  data,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
}: {
  data: { totalCount: number; transactions: TransactionWithData[] };
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter] = React.useState("all");

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = data?.transactions ?? [];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.customer.address.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [data, filterValue, statusFilter]);

  const pages = data?.totalCount
    ? Math.ceil(data?.totalCount / rowsPerPage)
    : 0;

  const renderCell = React.useCallback((transaction: any, columnKey: any) => {
    const cellValue = transaction[columnKey];

    switch (columnKey) {
      case "amount":
        return `$${parseFloat(cellValue).toFixed(2)}`;
      case "customer":
        return shortenAddress(cellValue.address);
      case "hash":
        return (
          <Link
            href={`https://base.blockscout.com/tx/${cellValue}`}
            target="_blank"
            className=" hover:text-blue-600 flex flex-row items-center gap-2"
          >
            <LinkIcon className="w-3 h-3" />
            <div className="mt-1">{shortenAddress(cellValue)}</div>
          </Link>
        );
      case "product":
        return (
          <div className="flex flex-row space-x-2 items-center">
            {cellValue.imageUrl ? (
              <Avatar size="md" radius="lg" src={cellValue.imageUrl} />
            ) : (
              <Avatar
                size="md"
                radius="lg"
                icon={<PackageIcon color="grey" />}
              />
            )}
            <p>{cellValue.name}</p>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e: unknown) => {
    setRowsPerPage(Number((e as any).target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: string | undefined) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by customer.."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.totalCount} transactions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Transactions per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10" selected={rowsPerPage === 10}>
                10
              </option>
              <option value="25" selected={rowsPerPage === 25}>
                25
              </option>
              <option value="50" selected={rowsPerPage === 50}>
                50
              </option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    data?.transactions?.length,
    onRowsPerPageChange,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    if (
      !data?.transactions ||
      data.transactions.length === 0 ||
      data.transactions.length < rowsPerPage
    ) {
      return <div />;
    }
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400"></span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            // allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No transactions found"}
        items={data.transactions}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
