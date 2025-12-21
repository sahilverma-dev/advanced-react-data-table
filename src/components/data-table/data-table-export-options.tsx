/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";

import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableExportOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableExportOptions<TData>({
  table,
}: DataTableExportOptionsProps<TData>) {
  const handleExport = (type: "csv" | "xlsx") => {
    const rows = table.getFilteredRowModel().rows;

    const data = rows.map((row) => {
      const rowData: Record<string, any> = {};
      row.getVisibleCells().forEach((cell) => {
        const column = cell.column;
        // Skip display-only columns like "actions" or "select"
        if (column.id === "actions" || column.id === "select") return;

        const header =
          typeof column.columnDef.header === "function"
            ? column.id
            : (column.columnDef.header as string) || column.id;

        // For cell value, we can use `cell.getValue()`
        rowData[header] = cell.getValue();
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Auto-width for columns (simple buffer)
    const max_width = data.reduce(
      (w, r) => Math.max(w, JSON.stringify(r).length),
      10
    );
    worksheet["!cols"] = [{ wch: max_width }];

    XLSX.writeFile(workbook, `export.${type}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 size-3" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          Export to Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
