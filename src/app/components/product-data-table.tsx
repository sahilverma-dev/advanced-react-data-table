// product.faker.ts
import { faker } from "@faker-js/faker";
import type { Product, ProductCategory, ProductStatus } from "../types/product";

import { useProductColumns } from "../hooks/useProductColumns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
// import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

const categories: ProductCategory[] = [
  "electronics",
  "fashion",
  "grocery",
  "home",
  "beauty",
  "sports",
];

const statuses: ProductStatus[] = [
  "active",
  "inactive",
  "out_of_stock",
  "discontinued",
];

const generateProduct = (): Product => {
  const costPrice = faker.number.float({ min: 5, max: 500, fractionDigits: 2 });
  const retailPrice = faker.number.float({
    min: costPrice + 5,
    max: costPrice * 1.8,
    fractionDigits: 2,
  });

  const discountPercent = faker.number.int({ min: 0, max: 40 });
  const finalPrice = Number(
    (retailPrice * (1 - discountPercent / 100)).toFixed(2)
  );

  return {
    /** Core */
    id: faker.string.uuid(),
    sku: faker.commerce.isbn(10),
    barcode: faker.string.numeric(13),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    category: faker.helpers.arrayElement(categories),

    /** Pricing */
    costPrice,
    retailPrice,
    discountPercent,
    finalPrice,
    currency: faker.helpers.arrayElement(["USD", "EUR", "INR"]),

    /** Inventory */
    stockQty: faker.number.int({ min: 0, max: 5000 }),
    reservedQty: faker.number.int({ min: 0, max: 500 }),
    reorderLevel: faker.number.int({ min: 10, max: 200 }),
    warehouseLocation: `WH-${faker.location.city().slice(0, 3).toUpperCase()}`,
    supplierName: faker.company.name(),
    supplierEmail: faker.internet.email(),

    /** Status */
    status: faker.helpers.arrayElement(statuses),
    isFeatured: faker.datatype.boolean(),
    isReturnable: faker.datatype.boolean(),
    isTaxable: faker.datatype.boolean(),

    /** Analytics */
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
    reviewCount: faker.number.int({ min: 0, max: 5000 }),
    views: faker.number.int({ min: 0, max: 1_000_000 }),
    salesCount: faker.number.int({ min: 0, max: 50_000 }),

    /** Logistics */
    weightKg: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
    heightCm: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    widthCm: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    lengthCm: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
    shippingClass: faker.helpers.arrayElement([
      "standard",
      "express",
      "freight",
    ]),

    /** Dates */
    launchDate: faker.date.past({ years: 2 }),
    lastRestockedAt: faker.datatype.boolean()
      ? faker.date.recent({ days: 60 })
      : null,
    expiryDate:
      faker.datatype.boolean() &&
      faker.helpers.arrayElement(categories) === "grocery"
        ? faker.date.future({ years: 1 })
        : null,
    createdAt: faker.date.past({ years: 3 }),
    updatedAt: faker.date.recent({ days: 30 }),

    /** Meta */
    tags: faker.helpers.uniqueArray(faker.commerce.productAdjective, 3),
    notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
  };
};

const products = Array.from({ length: 100 }, () => generateProduct());
const ProductDataTable = () => {
  const columns = useProductColumns();

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: products,
    columns,
    pageCount: 1,
    enableAdvancedFilter: true,
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: {
        left: ["select"],
        right: ["actions"],
      },
    },
    // queryKeys:["products"],
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table}>
      {/* <DataTableToolbar table={table} /> */}

      {/* <DataTableToolbar table={table}>
        <DataTableSortList table={table} align="end" />
        </DataTableToolbar> */}
      <DataTableAdvancedToolbar table={table}>
        <DataTableViewOptions table={table} />
        <DataTableSortList table={table} align="start" />
        <DataTableFilterList
          table={table}
          shallow={shallow}
          debounceMs={debounceMs}
          throttleMs={throttleMs}
          align="start"
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
};

export default ProductDataTable;
