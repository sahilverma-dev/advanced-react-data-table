import type { Table } from "@tanstack/table-core";
import type { Product } from "../types/product";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import React from "react";
import { Trash2Icon, XIcon } from "lucide-react";

interface ProductTableActionBarProps {
  table: Table<Product>;
}

const ProductTableActionBar = ({ table }: ProductTableActionBarProps) => {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        <span className="font-medium">{rows.length}</span>
        <span>selected</span>
        <ActionBarSeparator />
        <ActionBarClose>
          <XIcon />
        </ActionBarClose>
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <ActionBarItem>Export</ActionBarItem>
        <ActionBarItem variant="destructive">
          <Trash2Icon />
          Delete
        </ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  );
};

export default ProductTableActionBar;
