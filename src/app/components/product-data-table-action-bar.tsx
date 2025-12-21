import type { Table } from "@tanstack/table-core";
import { Trash2Icon, XIcon, DownloadIcon } from "lucide-react";
import React, { useState } from "react";

import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { exportTableToCSV, exportTableToXLSX } from "@/lib/export";
import type { Product } from "../types/product";

interface ProductTableActionBarProps {
  table: Table<Product>;
}

const ProductTableActionBar = ({ table }: ProductTableActionBarProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  const handleDelete = () => {
    // Implement delete logic here
    console.log(
      "Deleting rows:",
      rows.map((r) => r.original)
    );
    table.toggleAllRowsSelected(false);
    setShowDeleteDialog(false);
  };

  return (
    <>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionBarItem>
                <DownloadIcon />
                Export
              </ActionBarItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuItem
                onClick={() =>
                  exportTableToCSV(table, {
                    filename: "products-selected",
                    onlySelected: true,
                  })
                }
              >
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  exportTableToXLSX(table, {
                    filename: "products-selected",
                    onlySelected: true,
                  })
                }
              >
                Export to Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ActionBarItem
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2Icon />
            Delete
          </ActionBarItem>
        </ActionBarGroup>
      </ActionBar>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {rows.length} selected row(s). This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductTableActionBar;
