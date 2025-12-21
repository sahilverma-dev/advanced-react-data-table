"use client";

import { DataTable } from "@/components/data-table/components/data-table";
import { useDataTable } from "@/components/data-table/hooks/useDataTable";
import { faker } from "@faker-js/faker";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
interface Product {
  id: string;
  name: string;
  photo: string;
  rating: number;
  category: string;
  price: number;
  stock: number;
  description: string;
  brand: string;
  sku: string;
  weight: number;
  dimensions: string;
  color: string;
  material: string;
  manufacturer: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  discount: number;
  tags: string[];
  supplier: string;
  warranty: string;
  shippingMethod: string;
  returnPolicy: string;
  barcode: string;
  origin: string;
  taxRate: number;
  currency: string;
  reviewsCount: number;
  averageRating: number;
}

const getProducts = (length: number): Product[] => {
  return Array.from({ length }, () => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    photo: faker.image.url(),
    rating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
    category: faker.commerce.department(),
    price: Number(faker.commerce.price()),
    stock: faker.number.int({ min: 0, max: 1000 }),
    description: faker.commerce.productDescription(),
    brand: faker.company.name(),
    sku: faker.string.alphanumeric(8),
    weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
    dimensions: `${faker.number.int(100)}x${faker.number.int(
      100
    )}x${faker.number.int(100)}`,
    color: faker.color.human(),
    material: faker.commerce.productMaterial(),
    manufacturer: faker.company.name(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    isPublished: faker.datatype.boolean(),
    discount: faker.number.int({ min: 0, max: 50 }),
    tags: Array.from({ length: 3 }, () => faker.commerce.productAdjective()),
    supplier: faker.company.name(),
    warranty: `${faker.number.int({ min: 1, max: 5 })} years`,
    shippingMethod: faker.helpers.arrayElement([
      "Standard",
      "Express",
      "Next Day",
    ]),
    returnPolicy: faker.helpers.arrayElement([
      "30 days",
      "60 days",
      "No returns",
    ]),
    barcode: faker.string.numeric(13),
    origin: faker.location.country(),
    taxRate: faker.number.float({ min: 0, max: 25, fractionDigits: 1 }),
    currency: faker.finance.currencyCode(),
    reviewsCount: faker.number.int({ min: 0, max: 500 }),
    averageRating: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
  }));
};

const ProductDataTable = () => {
  const products = useMemo(() => getProducts(200), []);
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      // { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "photo", header: "Photo" },
      { accessorKey: "rating", header: "Rating" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "brand", header: "Brand" },
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "weight", header: "Weight" },
      { accessorKey: "dimensions", header: "Dimensions" },
      { accessorKey: "color", header: "Color" },
      { accessorKey: "material", header: "Material" },
      { accessorKey: "manufacturer", header: "Manufacturer" },
      { accessorKey: "createdAt", header: "Created At" },
      { accessorKey: "updatedAt", header: "Updated At" },
      { accessorKey: "isPublished", header: "Published" },
      { accessorKey: "discount", header: "Discount" },
      { accessorKey: "tags", header: "Tags" },
      { accessorKey: "supplier", header: "Supplier" },
      { accessorKey: "warranty", header: "Warranty" },
      { accessorKey: "shippingMethod", header: "Shipping Method" },
      { accessorKey: "returnPolicy", header: "Return Policy" },
      { accessorKey: "barcode", header: "Barcode" },
      { accessorKey: "origin", header: "Origin" },
      { accessorKey: "taxRate", header: "Tax Rate" },
      { accessorKey: "currency", header: "Currency" },
      { accessorKey: "reviewsCount", header: "Reviews Count" },
      { accessorKey: "averageRating", header: "Average Rating" },
    ],
    []
  );

  const { table } = useDataTable({
    data: products,
    columns,
    pageCount: 10,
  });

  //   const
  return (
    <div className="container mx-auto py-10">
      <DataTable table={table} />
    </div>
  );
};

export default ProductDataTable;
