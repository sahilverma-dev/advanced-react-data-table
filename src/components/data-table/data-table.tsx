import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  type Table as TanstackTable,
  type Column,
} from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

// Helper to determine if a cell is pinned and add appropriate border classes
const getPinnedClasses = <TData,>(column: Column<TData>, isHeader = false) => {
  const isPinned = column.getIsPinned();
  if (!isPinned) return "";

  // Add border-l or border-r based on pinning side
  // Also add background because sticky elements are transparent by default
  const side =
    isPinned === "left"
      ? "shadow-[inset_-1px_0_0_0_hsl(var(--border))]"
      : "shadow-[inset_1px_0_0_0_hsl(var(--border))]";
  return cn("sticky z-10 bg-background", side, isHeader && "z-20");
};

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
  height?: string | number;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  isLoading,
  skeletonRows = 20,
  height = 500,
  ...props
}: DataTableProps<TData>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40, // Height of a single row
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start ?? 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0;

  return (
    <div className={cn("flex w-full flex-col gap-2.5 ", className)} {...props}>
      {children}
      <ScrollArea
        className="overflow-auto relative rounded-md border"
        style={{ height }}
        viewportRef={scrollRef}
      >
        <Table className="relative w-full border-collapse table-fixed overflow-x-visible">
          <TableHeader className="sticky top-0 left-0 z-20 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "border-b border-r last:border-r-0",
                      getPinnedClasses(header.column, true)
                    )}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : typeof header.column
                        .columnDef.header === "function" ? (
                      <div className="p-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    ) : (
                      <DataTableColumnHeader header={header} table={table} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* BODY */}
          {isLoading ? (
            <TableBody>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i}>
                  {table.getAllColumns().map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(
                        "px-2 border-r last:border-r-0",
                        getPinnedClasses(col)
                      )}
                      style={{
                        ...getCommonPinningStyles({ column: col }),
                        width: col.getSize(),
                      }}
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {rows.length > 0 ? (
                <>
                  {paddingTop > 0 && (
                    <TableRow>
                      <TableCell style={{ height: `${paddingTop}px` }} />
                    </TableRow>
                  )}
                  {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                      <TableRow
                        key={row.id}
                        // data-index is important for dynamic row height virtualization if we upgrade
                        data-index={virtualRow.index}
                        // need to pass ref for dynamic measurement if needed, but fixed estimate is fine for now
                        ref={virtualizer.measureElement}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "px-4",
                              cell.column.columnDef.meta?.cell?.variant ===
                                "long-text"
                                ? "whitespace-normal wrap-break-word"
                                : "truncate",
                              "border-r last:border-r-0",
                              getPinnedClasses(cell.column)
                            )}
                            style={{
                              ...getCommonPinningStyles({
                                column: cell.column,
                              }),
                              width: cell.column.getSize(),
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                  {paddingBottom > 0 && (
                    <TableRow>
                      <TableCell style={{ height: `${paddingBottom}px` }} />
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
