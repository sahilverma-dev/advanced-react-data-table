import type { Table } from "@tanstack/table-core";
import type { Product } from "../types/product";

interface ProductTableActionBarProps {
  table: Table<Product>;
}

const ProductTableActionBar = ({ table }: ProductTableActionBarProps) => {
  return <div>ProductTableActionBar</div>;
};

export default ProductTableActionBar;
