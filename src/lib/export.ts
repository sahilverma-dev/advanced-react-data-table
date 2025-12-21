/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Table } from "@tanstack/react-table";
import * as XLSX from "xlsx";

export function exportTableToCSV<TData>(
  table: Table<TData>,
  {
    filename = "export",
    excludeColumns = ["select", "actions"],
    onlySelected = false,
  }: {
    filename?: string;
    excludeColumns?: string[];
    onlySelected?: boolean;
  } = {}
) {
  const rows = onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const data = rows.map((row) => {
    const rowData: Record<string, any> = {};
    row.getVisibleCells().forEach((cell) => {
      const column = cell.column;
      if (excludeColumns.includes(column.id)) return;

      const header =
        typeof column.columnDef.header === "function"
          ? column.id
          : (column.columnDef.header as string) || column.id;

      rowData[header] = cell.getValue();
    });
    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.csv`);
}

export function exportTableToXLSX<TData>(
  table: Table<TData>,
  {
    filename = "export",
    excludeColumns = ["select", "actions"],
    onlySelected = false,
  }: {
    filename?: string;
    excludeColumns?: string[];
    onlySelected?: boolean;
  } = {}
) {
  const rows = onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getFilteredRowModel().rows;

  const data = rows.map((row) => {
    const rowData: Record<string, any> = {};
    row.getVisibleCells().forEach((cell) => {
      const column = cell.column;
      if (excludeColumns.includes(column.id)) return;

      const header =
        typeof column.columnDef.header === "function"
          ? column.id
          : (column.columnDef.header as string) || column.id;

      rowData[header] = cell.getValue();
    });
    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Auto-width for columns
  const max_width = data.reduce(
    (w, r) => Math.max(w, JSON.stringify(r).length),
    10
  );
  worksheet["!cols"] = [{ wch: max_width }];

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
