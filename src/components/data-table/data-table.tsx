import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  isLoading?: boolean; // for skeleton
  numberOfSkeletonRows?: number; // for skeleton
  isFetching?: boolean; // for top loader
  actionBar?: React.ReactNode;
  height?: string | number; // New custom height prop
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  isLoading,
  isFetching,
  numberOfSkeletonRows = 10,
  height,
  ...props
}: DataTableProps<TData>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1].end || 0)
      : 0;

  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-hidden", className)}
      {...props}
    >
      {children}
      <ScrollArea className="border rounded-none">
        <div
          ref={parentRef}
          style={{
            height: height ?? "calc(100vh - 200px)", // Default fallback or use prop
          }}
        >
          <table
            className="w-full flex flex-col caption-bottom text-xs"
            style={{
              width: table.getTotalSize(),
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const commonPinningStyles = getCommonPinningStyles({
                      column: header.column,
                    });
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...commonPinningStyles,
                          // Ensure sticky header behavior
                          position: "sticky",
                          top: 0,
                          zIndex: header.column.getIsPinned() ? 2 : 1,
                          background: header.column.getIsPinned()
                            ? "var(--background)"
                            : "var(--secondary)", // Slight contrast for header

                          width: `calc(${
                            getCommonPinningStyles({
                              column: header.column,
                            }).width
                          }px)`,
                        }}
                        className="border relative"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanResize() && (
                          <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn(
                              "absolute top-0 right-0 h-full w-1 cursor-col-resize user-select-none touch-none hover:bg-primary/50",
                              header.column.getIsResizing() && "bg-primary"
                            )}
                          />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                Array.from({ length: numberOfSkeletonRows }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    {table.getAllColumns().map((column) => (
                      <TableCell
                        key={column.id}
                        style={{
                          ...getCommonPinningStyles({ column }),
                        }}
                        className="border"
                      >
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                <>
                  {paddingTop > 0 && (
                    <tr>
                      <td style={{ height: `${paddingTop}px` }} />
                    </tr>
                  )}
                  {virtualRows.map((virtualRow) => {
                    const row = table.getRowModel().rows[virtualRow.index];
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          data-index={virtualRow.index}
                          ref={virtualizer.measureElement}
                          data-state={row.getIsSelected() && "selected"}
                          className="even:bg-muted/30 hover:bg-muted/80 data-[state=selected]:bg-primary/20 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getCommonPinningStyles({
                                  column: cell.column,
                                }),
                                ...(row.getIsSelected() &&
                                  cell.column.getIsPinned() && {
                                    background: "var(--muted)",
                                  }),

                                width: `calc(${
                                  getCommonPinningStyles({
                                    column: cell.column,
                                  }).width
                                }px)`,
                              }}
                              className="border"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                  {paddingBottom > 0 && (
                    <tr>
                      <td style={{ height: `${paddingBottom}px` }} />
                    </tr>
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
              {isFetching && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-10 p-0"
                  >
                    <div className="flex w-full items-center justify-center gap-2 bg-secondary/50 p-2 text-muted-foreground text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </table>

          <ScrollBar orientation="horizontal" />
        </div>
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
