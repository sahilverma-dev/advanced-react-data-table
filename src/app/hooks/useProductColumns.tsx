import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { Product } from "../types/product";
import {
  Text,
  Hash,
  ScanBarcode,
  Tag,
  Folder,
  Activity,
  CircleDollarSign,
  Percent,
  Banknote,
  Package,
  PackageCheck,
  ArrowDownToLine,
  MapPin,
  Truck,
  Mail,
  Star,
  MessageSquare,
  Eye,
  TrendingUp,
  Weight,
  Ruler,
  RefreshCcw,
  Receipt,
  Calendar,
  Tags,
  FileText,
  EllipsisVerticalIcon,
} from "lucide-react";
// import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@/components/animate-ui/components/base/tooltip";
import { Badge } from "@/components/ui/badge";
import DataTableCheckboxCell from "@/components/data-table/cells/data-table-user-cell";
import { DataTableHighlightCell } from "@/components/data-table/data-table-highlight-cell";

export const useProductColumns = () => {
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all"
            className="translate-y-0.5"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            className="translate-y-0.5"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableHiding: false,
        enableSorting: false,
        size: 40,
      },
      // Core
      {
        enableColumnFilter: true,
        meta: {
          label: "Name",
          placeholder: "Search names...",
          variant: "text",
          icon: Text,
        },
        accessorKey: "name",
        header: "Name",
        cell: ({ row, table }) => (
          <DataTableHighlightCell value={row.getValue("name")} table={table} />
        ),
        size: 220,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "SKU",
          placeholder: "Search SKU...",
          variant: "text",
          icon: Hash,
        },
        accessorKey: "sku",
        header: "SKU",
        size: 140,
        cell: ({ row, table }) => (
          <DataTableHighlightCell value={row.getValue("sku")} table={table} />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Barcode",
          placeholder: "Search barcode...",
          variant: "text",
          icon: ScanBarcode,
        },
        accessorKey: "barcode",
        header: "Barcode",
        size: 150,
        cell: ({ row, table }) => (
          <DataTableHighlightCell
            value={row.getValue("barcode")}
            table={table}
          />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Brand",
          placeholder: "Search brand...",
          variant: "text",
          icon: Tag,
        },
        accessorKey: "brand",
        header: "Brand",
        size: 140,
        cell: ({ row, table }) => (
          <DataTableHighlightCell value={row.getValue("brand")} table={table} />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Category",
          placeholder: "Search category...",
          variant: "text",
          icon: Folder,
        },
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue, table }) => {
          const value = getValue();

          return value ? (
            <Badge className="capitalize">
              <DataTableHighlightCell value={value as string} table={table} />
            </Badge>
          ) : null;
        },
        size: 130,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Status",
          placeholder: "Filter status...",
          variant: "text",
          icon: Activity,
        },
        accessorKey: "status",
        header: "Status",
        size: 130,
        cell: ({ getValue }) => {
          const value = getValue();

          return value ? (
            <Badge className="capitalize">{value as string}</Badge>
          ) : null;
        },
      },

      // Pricing
      {
        enableColumnFilter: true,
        meta: {
          label: "Cost Price",
          placeholder: "Filter cost...",
          variant: "number",
          icon: CircleDollarSign,
        },
        accessorKey: "costPrice",
        header: "Cost",
        size: 200,
        cell: ({ getValue }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getValue<number>()),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Retail Price",
          placeholder: "Filter retail...",
          variant: "number",
          icon: CircleDollarSign,
        },
        accessorKey: "retailPrice",
        header: "Retail",
        size: 100,

        cell: ({ getValue }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getValue<number>()),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Discount %",
          placeholder: "Filter discount...",
          variant: "number",
          icon: Percent,
        },
        accessorKey: "discountPercent",
        header: "Discount %",
        size: 110,
        cell: ({ getValue }) => `${getValue<number>()}%`,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Final Price",
          placeholder: "Filter price...",
          variant: "number",
          icon: CircleDollarSign,
        },
        accessorKey: "finalPrice",
        header: "Final Price",
        size: 120,

        cell: ({ getValue }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getValue<number>()),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Currency",
          placeholder: "Filter currency...",
          variant: "text",
          icon: Banknote,
        },
        accessorKey: "currency",
        header: "Currency",
        size: 90,
        cell: ({ getValue }) => {
          const value = getValue();

          return value ? (
            <Badge className="capitalize">{value as string}</Badge>
          ) : null;
        },
      },

      // Inventory
      {
        enableColumnFilter: true,
        meta: {
          label: "Stock",
          placeholder: "Filter stock...",
          variant: "number",
          icon: Package,
        },
        accessorKey: "stockQty",
        header: "Stock",
        size: 90,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Reserved",
          placeholder: "Filter reserved...",
          variant: "number",
          icon: PackageCheck,
        },
        accessorKey: "reservedQty",
        header: "Reserved",
        size: 100,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Reorder Level",
          placeholder: "Filter reorder...",
          variant: "number",
          icon: ArrowDownToLine,
        },
        accessorKey: "reorderLevel",
        header: "Reorder @",
        size: 110,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Warehouse",
          placeholder: "Search warehouse...",
          variant: "text",
          icon: MapPin,
        },
        accessorKey: "warehouseLocation",
        header: "Warehouse",
        size: 140,
        cell: ({ row, table }) => (
          <DataTableHighlightCell
            value={row.getValue("warehouseLocation")}
            table={table}
          />
        ),
      },

      // Supplier
      {
        enableColumnFilter: true,
        meta: {
          label: "Supplier",
          placeholder: "Search supplier...",
          variant: "text",
          icon: Truck,
        },
        accessorKey: "supplierName",
        header: "Supplier",
        size: 180,
        cell: ({ row, table }) => (
          <DataTableHighlightCell
            value={row.getValue("supplierName")}
            table={table}
          />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Supplier Email",
          placeholder: "Search email...",
          variant: "text",
          icon: Mail,
        },
        accessorKey: "supplierEmail",
        header: "Supplier Email",
        size: 220,
        cell: ({ row, table }) => (
          <DataTableHighlightCell
            value={row.getValue("supplierEmail")}
            table={table}
          />
        ),
      },

      // Analytics
      {
        enableColumnFilter: true,
        meta: {
          label: "Rating",
          placeholder: "Filter rating...",
          variant: "number",
          icon: Star,
        },
        accessorKey: "rating",
        header: "Rating",
        size: 90,
        cell: ({ getValue }) => `${getValue<number>().toFixed(1)} ★`,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Reviews",
          placeholder: "Filter reviews...",
          variant: "number",
          icon: MessageSquare,
        },
        accessorKey: "reviewCount",
        header: "Reviews",
        size: 100,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Views",
          placeholder: "Filter views...",
          variant: "number",
          icon: Eye,
        },
        accessorKey: "views",
        header: "Views",
        size: 120,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Sales",
          placeholder: "Filter sales...",
          variant: "number",
          icon: TrendingUp,
        },
        accessorKey: "salesCount",
        header: "Sales",
        size: 120,
      },

      // Logistics
      {
        enableColumnFilter: true,
        meta: {
          label: "Weight",
          placeholder: "Filter weight...",
          variant: "number",
          icon: Weight,
        },
        accessorKey: "weightKg",
        header: "Weight (kg)",
        size: 120,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Height",
          placeholder: "Filter height...",
          variant: "number",
          icon: Ruler,
        },
        accessorKey: "heightCm",
        header: "Height (cm)",
        size: 120,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Width",
          placeholder: "Filter width...",
          variant: "number",
          icon: Ruler,
        },
        accessorKey: "widthCm",
        header: "Width (cm)",
        size: 120,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Length",
          placeholder: "Filter length...",
          variant: "number",
          icon: Ruler,
        },
        accessorKey: "lengthCm",
        header: "Length (cm)",
        size: 120,
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Shipping Class",
          placeholder: "Search class...",
          variant: "text",
          icon: Truck,
        },
        accessorKey: "shippingClass",
        header: "Shipping Class",
        size: 140,
        cell: ({ row, table }) => (
          <DataTableHighlightCell
            value={row.getValue("shippingClass")}
            table={table}
          />
        ),
      },

      // Flags
      {
        enableColumnFilter: true,
        meta: {
          label: "Featured",
          placeholder: "Filter featured...",
          variant: "select",
          icon: Star,
        },
        accessorKey: "isFeatured",
        header: "Featured",
        size: 100,
        // cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
        cell: ({ getValue }) => (
          <DataTableCheckboxCell checked={getValue<boolean>()} />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Returnable",
          placeholder: "Filter returnable...",
          variant: "select",
          icon: RefreshCcw,
        },
        accessorKey: "isReturnable",
        header: "Returnable",
        size: 110,
        // cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
        cell: ({ getValue }) => (
          <DataTableCheckboxCell checked={getValue<boolean>()} />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Taxable",
          placeholder: "Filter taxable...",
          variant: "select",
          icon: Receipt,
        },
        accessorKey: "isTaxable",
        header: "Taxable",
        size: 100,
        // cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
        cell: ({ getValue }) => (
          <DataTableCheckboxCell checked={getValue<boolean>()} />
        ),
      },

      // Dates
      {
        enableColumnFilter: true,
        meta: {
          label: "Launch Date",
          placeholder: "Filter launch...",
          variant: "date",
          icon: Calendar,
        },
        accessorKey: "launchDate",
        header: "Launch Date",
        size: 140,
        cell: ({ getValue }) => {
          const dateValue = getValue<string | Date>();
          if (!dateValue) return null;

          const date = new Date(dateValue);
          const formattedDate = date.toLocaleDateString();
          const fullDate = new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
          }).format(date);

          return (
            <Tooltip>
              <TooltipTrigger>{formattedDate}</TooltipTrigger>
              <TooltipPanel>
                <p>{fullDate}</p>
              </TooltipPanel>
            </Tooltip>
          );
        },
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Restocked At",
          placeholder: "Filter restocked...",
          variant: "date",
          icon: Calendar,
        },
        accessorKey: "lastRestockedAt",
        header: "Restocked At",
        size: 150,
        cell: ({ getValue }) =>
          getValue<Date | null>()
            ? new Date(getValue<Date>()).toLocaleDateString()
            : "—",
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Expiry Date",
          placeholder: "Filter expiry...",
          variant: "date",
          icon: Calendar,
        },
        accessorKey: "expiryDate",
        header: "Expiry Date",
        size: 140,
        cell: ({ getValue }) =>
          getValue<Date | null>()
            ? new Date(getValue<Date>()).toLocaleDateString()
            : "—",
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Created",
          placeholder: "Filter created...",
          variant: "date",
          icon: Calendar,
        },
        accessorKey: "createdAt",
        header: "Created",
        size: 140,
        cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Updated",
          placeholder: "Filter updated...",
          variant: "date",
          icon: Calendar,
        },
        accessorKey: "updatedAt",
        header: "Updated",
        size: 140,
        cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
      },

      // Meta
      {
        enableColumnFilter: true,
        meta: {
          label: "Tags",
          placeholder: "Search tags...",
          variant: "text",
          icon: Tags,
        },
        accessorKey: "tags",
        header: "Tags",
        size: 220,
        cell: ({ getValue, table }) => (
          <DataTableHighlightCell
            value={getValue<string[]>().join(", ")}
            table={table}
          />
        ),
      },
      {
        enableColumnFilter: true,
        meta: {
          label: "Notes",
          placeholder: "Search notes...",
          variant: "text",
          icon: FileText,
        },
        accessorKey: "notes",
        header: "Notes",

        cell: ({ getValue, table }) => (
          <DataTableHighlightCell
            value={getValue<string | null>() ?? "—"}
            table={table}
          />
        ),
      },
      {
        enableColumnFilter: false,
        accessorKey: "actions",
        header: () => null,
        enableHiding: false,
        enableResizing: false,
        enableSorting: false,
        size: 40,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel
                onClick={() => {
                  console.log(row.original);
                }}
              >
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return columns;
};
