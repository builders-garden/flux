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
  Chip,
} from "@nextui-org/react";
import { columns } from "./data";
import { SearchIcon } from "lucide-react";
import { Product, Subscription, User } from "@prisma/client";
import { shortenAddress } from "@/lib/utils";
import IdChip from "@/components/id-chip";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "subscriberAddress",
  "product",
  "price",
  "status",
  "createdAt",
];

type SubscriptionWithCustomer = Subscription & {
  product: Product & { user: User };
};

export default function SubscriptionsTable({
  subscriptions,
}: {
  subscriptions: SubscriptionWithCustomer[];
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...subscriptions];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((subscription) =>
        subscription.subscriberAddress
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [subscriptions, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((subscription: any, columnKey: any) => {
    const cellValue = subscription[columnKey];
    console.log(subscription);
    switch (columnKey) {
      case "id":
        return <IdChip id={cellValue} />;
      case "price":
        return `$${subscription.product.price} / month`;
      case "status":
        return (
          <Chip color="success" size="sm">
            Active
          </Chip>
        );
      case "product":
        return cellValue.name;
      case "subscriberAddress":
        return shortenAddress(cellValue);
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
            Total {subscriptions.length} subscriptions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Subscriptions per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    subscriptions.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    if (subscriptions.length === 0) {
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
  }, [items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
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
      <TableBody emptyContent={"No subscriptions found"} items={items}>
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
