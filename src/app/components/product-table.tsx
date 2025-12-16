import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DataTableDefaultCell from "@/components/data-table/cells/data-table-default-cell";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { Checkbox } from "@/components/ui/checkbox";
import { useDataTable } from "@/hooks/use-data-table";
import { faker } from "@faker-js/faker";
import type { ColumnDef } from "@tanstack/react-table";
import { HomeIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterMenu } from "@/components/data-table/data-table-filter-menu";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  material: string;
  color: string;
  adjective: string;
  brand: string;
  stock: number;
  weight: number;
  dimensions: string; // e.g., "10x20x5 cm"
  sku: string;
  manufacturer: string;
  releaseDate: Date;
  rating: number; // 1.0 - 5.0
  reviewsCount: number;
  isActive: boolean;
  imageUrl: string;
  barcode: string;
  supplier: string;
  warranty: string; // e.g., "1 year"
  countryOfOrigin: string;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  discountPercentage: number;
  currency: string;
  tags: string[];
  metadata: Record<string, string>; // For extra dynamic fields
}

const generateFakeProduct = (): Product => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
  category: faker.commerce.department(),
  material: faker.commerce.productMaterial(),
  color: faker.color.human(),
  adjective: faker.commerce.productAdjective(),
  brand: faker.company.name(),
  stock: faker.number.int({ min: 0, max: 500 }),
  weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
  dimensions: `${faker.number.int({ min: 5, max: 100 })}x${faker.number.int({
    min: 5,
    max: 100,
  })}x${faker.number.int({ min: 1, max: 50 })} cm`,
  sku: faker.string.alphanumeric(10).toUpperCase(),
  manufacturer: faker.company.name(),
  releaseDate: faker.date.past({ years: 5 }),
  rating: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
  reviewsCount: faker.number.int({ min: 0, max: 1000 }),
  isActive: faker.datatype.boolean(),
  imageUrl: faker.image.url({ height: 100, width: 100 }),
  barcode: faker.string.numeric(12),
  supplier: faker.company.name(),
  warranty: `${faker.number.int({ min: 1, max: 5 })} year${
    faker.number.int({ min: 1, max: 5 }) > 1 ? "s" : ""
  }`,
  countryOfOrigin: faker.location.country(),
  createdAt: faker.date.past({ years: 2 }),
  updatedAt: faker.date.recent({ days: 30 }),
  isFeatured: faker.datatype.boolean(),
  discountPercentage: faker.number.int({ min: 0, max: 50 }),
  currency: faker.finance.currencyCode(),
  tags: faker.helpers.arrayElements(
    ["electronics", "home", "garden", "tools", "clothing", "books", "sports"],
    { min: 1, max: 3 }
  ),
  metadata: {
    origin: faker.location.city(),
    packaging: faker.helpers.arrayElement(["box", "bag", "crate"]),
    ecoFriendly: faker.datatype.boolean().toString(),
  },
});

const productColumns: ColumnDef<Product>[] = [
  {
    id: "select",

    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        className="after:-inset-2.5 relative transition-[shadow,border] after:absolute after:content-[''] hover:border-primary/40 mr-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        aria-label="Select row"
        className="after:-inset-2.5 relative transition-[shadow,border] after:absolute after:content-[''] hover:border-primary/40 mr-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          const onRowSelect = table.options.meta?.onRowSelect;
          if (onRowSelect) {
            onRowSelect(row.index, !!value, false);
          } else {
            row.toggleSelected(!!value);
          }
        }}
        onClick={(event: React.MouseEvent) => {
          if (event.shiftKey) {
            event.preventDefault();
            const onRowSelect = table.options.meta?.onRowSelect;
            if (onRowSelect) {
              onRowSelect(row.index, !row.getIsSelected(), true);
            }
          }
        }}
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <DataTableDefaultCell>{row.getValue("id")}</DataTableDefaultCell>
    ),
    meta: {
      variant: "multiSelect",
      label: "ID",
      icon: HomeIcon,
    },
  },
  { header: "Name", accessorKey: "name" },
  { header: "Description", accessorKey: "description" },
  { header: "Price", accessorKey: "price" },
  { header: "Category", accessorKey: "category" },
  { header: "Material", accessorKey: "material" },
  { header: "Color", accessorKey: "color" },
  { header: "Adjective", accessorKey: "adjective" },
  { header: "Brand", accessorKey: "brand" },
  { header: "Stock", accessorKey: "stock" },
  { header: "Weight", accessorKey: "weight" },
  { header: "Dimensions", accessorKey: "dimensions" },
  { header: "SKU", accessorKey: "sku" },
  { header: "Manufacturer", accessorKey: "manufacturer" },
  { header: "Release Date", accessorKey: "releaseDate" },
  { header: "Rating", accessorKey: "rating" },
  { header: "Reviews", accessorKey: "reviewsCount" },
  { header: "Active", accessorKey: "isActive" },
  { header: "Image URL", accessorKey: "imageUrl" },
  { header: "Barcode", accessorKey: "barcode" },
  { header: "Supplier", accessorKey: "supplier" },
  { header: "Warranty", accessorKey: "warranty" },
  { header: "Country", accessorKey: "countryOfOrigin" },
  { header: "Created At", accessorKey: "createdAt" },
  { header: "Updated At", accessorKey: "updatedAt" },
  { header: "Featured", accessorKey: "isFeatured" },
  { header: "Discount %", accessorKey: "discountPercentage" },
  { header: "Currency", accessorKey: "currency" },
  { header: "Tags", accessorKey: "tags" },
  { header: "Metadata Origin", accessorKey: "metadata.origin" },
  { header: "Metadata Packaging", accessorKey: "metadata.packaging" },
  { header: "Metadata Eco-Friendly", accessorKey: "metadata.ecoFriendly" },
  {
    header: "Actions",
    id: "actions",
    meta: {
      variant: "text",
    },
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>More actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>More actions</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const data = Array.from({ length: 50 }, () => generateFakeProduct());

const ProductDataTable = () => {
  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns: productColumns,
    pageCount: 1,

    initialState: {
      columnPinning: {
        left: ["select"],
        right: ["actions"],
      },
    },

    // enableSearch: true,
    // enablePaste: true,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList
            table={table}
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
            align="start"
          />
          <DataTableFilterMenu
            table={table}
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
          />
        </DataTableAdvancedToolbar>
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>
    </DataTable>
  );
};

export default ProductDataTable;
