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
  Button,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { columns } from "./data";
import {
  BoxIcon,
  CopyIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import CreateProductModal from "@/components/modals/products/create-product-modal";
import DeleteProductModal from "@/components/modals/products/delete-product-modal";
import { useProductsStore } from "@/lib/store";
import UpdateProductModal from "@/components/modals/products/update-product-modal";

const INITIAL_VISIBLE_COLUMNS = ["name", "price", "createdAt", "actions"];

export default function ProductsTable({
  products,
  refetch,
}: {
  products: any[];
  refetch: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onOpenChange: onUpdateModalOpenChange,
  } = useDisclosure();
  const setUpdateProduct = useProductsStore((state) => state.setUpdateProduct);
  const setDeleteProduct = useProductsStore((state) => state.setDeleteProduct);
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
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredProducts;
  }, [products, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((product: any, columnKey: any) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-row space-x-2 items-center">
            {product.imageUrl ? (
              <Avatar size="md" radius="lg" src={product.imageUrl} />
            ) : (
              <Avatar size="md" radius="lg" icon={<BoxIcon color="grey" />} />
            )}
            <p className="font-bold">{cellValue}</p>
          </div>
        );
      case "price":
        return `$${cellValue}`;
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <MoreVerticalIcon size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                startContent={<PencilIcon size={14} />}
                key="edit"
                onClick={() => {
                  setUpdateProduct(product);
                  onUpdateModalOpen();
                }}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                startContent={<CopyIcon size={14} />}
                key="duplicate"
              >
                Duplicate
              </DropdownItem>
              <DropdownItem
                startContent={<Trash2Icon size={14} />}
                key="delete"
                className="text-danger"
                color="danger"
                onClick={() => {
                  setDeleteProduct(product);
                  onDeleteModalOpen();
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
            placeholder="Search by name.."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <Button startContent={<PlusIcon />} color="primary" onClick={onOpen}>
            Add product
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {products.length} products
          </span>
          <label className="flex items-center text-default-400 text-small">
            Products per page:
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
    products.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
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
    <>
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
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No products found"} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateProductModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        onModalClose={refetch}
      />
      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onOpenChange={onUpdateModalOpenChange}
        onOpen={onUpdateModalOpen}
        onModalClose={refetch}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onOpen={onDeleteModalOpen}
        onModalClose={refetch}
      />
    </>
  );
}
