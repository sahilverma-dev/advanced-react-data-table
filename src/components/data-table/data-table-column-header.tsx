"use client";

import type {
  ColumnSort,
  Header,
  SortDirection,
  SortingState,
  Table,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon } from "lucide-react";
import { getColumnVariant } from "@/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  header: Header<TData, TValue>;
  table: Table<TData>;
}

export function DataTableColumnHeader<TData, TValue>({
  header,
  table,
  className,
  onPointerDown,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const column = header.column;
  const label = column.columnDef.meta?.label
    ? column.columnDef.meta.label
    : typeof column.columnDef.header === "string"
    ? column.columnDef.header
    : column.id;

  const isAnyColumnResizing =
    table.getState().columnSizingInfo.isResizingColumn;

  const cellVariant = column.columnDef.meta?.cell;
  const columnVariant = getColumnVariant(cellVariant?.variant);

  const pinnedPosition = column.getIsPinned();
  const isPinnedLeft = pinnedPosition === "left";
  const isPinnedRight = pinnedPosition === "right";

  const onSortingChange = React.useCallback(
    (direction: SortDirection) => {
      table.setSorting((prev: SortingState) => {
        const existingSortIndex = prev.findIndex(
          (sort) => sort.id === column.id
        );
        const newSort: ColumnSort = {
          id: column.id,
          desc: direction === "desc",
        };

        if (existingSortIndex >= 0) {
          const updated = [...prev];
          updated[existingSortIndex] = newSort;
          return updated;
        } else {
          return [...prev, newSort];
        }
      });
    },
    [column.id, table]
  );

  const onSortRemove = React.useCallback(() => {
    table.setSorting((prev: SortingState) =>
      prev.filter((sort) => sort.id !== column.id)
    );
  }, [column.id, table]);

  const onLeftPin = React.useCallback(() => {
    column.pin("left");
  }, [column]);

  const onRightPin = React.useCallback(() => {
    column.pin("right");
  }, [column]);

  const onUnpin = React.useCallback(() => {
    column.pin(false);
  }, [column]);

  const onTriggerPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;

      if (event.button !== 0) {
        return;
      }
      table.options.meta?.onColumnClick?.(column.id);
    },
    [table.options.meta, column.id, onPointerDown]
  );

  if (column.columnDef.meta?.headerVariant === "simple") {
    return (
      <div className={cn("flex h-8 items-center space-x-2 text-xs", className)}>
        <span className="truncate">{label}</span>
        {header.column.getCanResize() && (
          <DataTableColumnResizer
            header={header}
            table={table}
            label={label as string}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn(
            "flex size-full items-center justify-between gap-2 text-xs px-2 hover:bg-accent/40 data-[state=open]:bg-accent/40 [&_svg]:size-4",
            isAnyColumnResizing && "pointer-events-none",
            className
          )}
          onPointerDown={onTriggerPointerDown}
          {...props}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {columnVariant && (
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <columnVariant.icon className="size-3.5 shrink-0 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{columnVariant.label}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <span className="truncate">{label}</span>
          </div>
          {column.getFilterValue() ? (
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-0.5">
              <span className="sr-only">Filter active</span>
              <div className="size-1.5 rounded-full bg-primary" />
            </div>
          ) : (
            <ChevronDownIcon className="shrink-0 text-muted-foreground" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={0} className="w-60">
          {column.getCanSort() && (
            <>
              <DropdownMenuCheckboxItem
                className="relative ltr:pr-8 ltr:pl-2 rtl:pr-2 rtl:pl-8 [&>span:first-child]:ltr:right-2 [&>span:first-child]:ltr:left-auto [&>span:first-child]:rtl:right-auto [&>span:first-child]:rtl:left-2 [&_svg]:text-muted-foreground"
                checked={column.getIsSorted() === "asc"}
                onClick={() => onSortingChange("asc")}
              >
                <ChevronUpIcon />
                Sort asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="relative ltr:pr-8 ltr:pl-2 rtl:pr-2 rtl:pl-8 [&>span:first-child]:ltr:right-2 [&>span:first-child]:ltr:left-auto [&>span:first-child]:rtl:right-auto [&>span:first-child]:rtl:left-2 [&_svg]:text-muted-foreground"
                checked={column.getIsSorted() === "desc"}
                onClick={() => onSortingChange("desc")}
              >
                <ChevronDownIcon />
                Sort desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() && (
                <DropdownMenuItem onClick={onSortRemove}>
                  <XIcon />
                  Remove sort
                </DropdownMenuItem>
              )}
            </>
          )}

          {column.getCanFilter() && (
            <>
              {column.getCanSort() && <DropdownMenuSeparator />}
              <DataTableColumnFilter header={header} />
            </>
          )}

          {column.getCanPin() && (
            <>
              {(column.getCanSort() || column.getCanFilter()) && (
                <DropdownMenuSeparator />
              )}

              {isPinnedLeft ? (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onUnpin}
                >
                  <PinOffIcon />
                  Unpin from left
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onLeftPin}
                >
                  <PinIcon />
                  Pin to left
                </DropdownMenuItem>
              )}
              {isPinnedRight ? (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onUnpin}
                >
                  <PinOffIcon />
                  Unpin from right
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="[&_svg]:text-muted-foreground"
                  onClick={onRightPin}
                >
                  <PinIcon />
                  Pin to right
                </DropdownMenuItem>
              )}
            </>
          )}
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground"
                onClick={() => column.toggleVisibility(false)}
              >
                <EyeOffIcon />
                Hide column
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {header.column.getCanResize() && (
        <DataTableColumnResizer
          header={header}
          table={table}
          label={label as string}
        />
      )}
    </>
  );
}

function DataTableColumnFilter<TData, TValue>({
  header,
}: {
  header: Header<TData, TValue>;
}) {
  const column = header.column;
  const variant = column.columnDef.meta?.variant ?? "text";
  const [value, setValue] = React.useState(column.getFilterValue());

  // Sync state with column filter value
  const filterValue = column.getFilterValue();
  React.useEffect(() => {
    setValue(filterValue);
  }, [filterValue]);

  const handleFilterChange = (val: unknown) => {
    setValue(val);
    column.setFilterValue(val);
  };

  if (variant === "text" || variant === "number") {
    return (
      <div className="p-2">
        <Input
          placeholder={`Search ${
            column.columnDef.meta?.label?.toLowerCase() ?? "values"
          }...`}
          value={(value as string) ?? ""}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="h-8"
        />
      </div>
    );
  }

  if (variant === "dateRange") {
    return (
      <div className="p-2">
        <Calendar
          mode="range"
          selected={
            Array.isArray(value) && value.length === 2
              ? {
                  from: value[0] ? new Date(value[0]) : undefined,
                  to: value[1] ? new Date(value[1]) : undefined,
                }
              : (value as any)
          }
          onSelect={(val) => {
            if (val) {
              const dateRange = val as { from?: Date; to?: Date };
              const newValue = [
                dateRange.from?.toISOString() ?? "",
                dateRange.to?.toISOString() ?? "",
              ];
              if (!newValue[0] && !newValue[1]) {
                handleFilterChange(undefined);
              } else {
                handleFilterChange(newValue);
              }
            } else {
              handleFilterChange(undefined);
            }
          }}
          numberOfMonths={2}
        />
      </div>
    );
  }

  // Multi-select / Select / Boolean
  const options = column.columnDef.meta?.options ?? [];
  const isMulti = variant === "multiSelect";

  return (
    <div className="p-2">
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = isMulti
                ? Array.isArray(value) &&
                  (value as any[]).includes(option.value)
                : value === option.value;

              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (isMulti) {
                      const current = Array.isArray(value)
                        ? (value as any[])
                        : [];
                      const next = current.includes(option.value)
                        ? current.filter((v) => v !== option.value)
                        : [...current, option.value];

                      // Prevent menu from closing
                      // Note: The event is not strictly exposed here in all versions of cmk,
                      // but we can try to rely on state update not closing it if we don't trigger typical close actions.
                      // However, standard Radix/CMDK dropdown items normally close on select.
                      // We'll rely on the parent causing re-render but we need to ensure visibility.
                      handleFilterChange(next.length ? next : undefined);
                    } else {
                      handleFilterChange(
                        value === option.value ? undefined : option.value
                      );
                    }
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className={cn("h-4 w-4")} />
                  </div>
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

const DataTableColumnResizer = React.memo(
  DataTableColumnResizerImpl,
  (prev, next) => {
    const prevColumn = prev.header.column;
    const nextColumn = next.header.column;

    if (
      prevColumn.getIsResizing() !== nextColumn.getIsResizing() ||
      prevColumn.getSize() !== nextColumn.getSize()
    ) {
      return false;
    }

    if (prev.label !== next.label) return false;

    return true;
  }
) as typeof DataTableColumnResizerImpl;

interface DataTableColumnResizerProps<TData, TValue>
  extends DataTableColumnHeaderProps<TData, TValue> {
  label: string;
}

function DataTableColumnResizerImpl<TData, TValue>({
  header,
  table,
  label,
}: DataTableColumnResizerProps<TData, TValue>) {
  const defaultColumnDef = table._getDefaultColumnDef();

  const onDoubleClick = React.useCallback(() => {
    header.column.resetSize();
  }, [header.column]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      aria-valuenow={header.column.getSize()}
      aria-valuemin={defaultColumnDef.minSize}
      aria-valuemax={defaultColumnDef.maxSize}
      tabIndex={0}
      className={cn(
        "after:-translate-x-1/2 -end-px absolute top-0 z-50 h-full w-0.5 cursor-ew-resize touch-none select-none bg-border transition-opacity after:absolute after:inset-y-0 after:start-1/2 after:h-full after:w-[18px] after:content-[''] hover:bg-primary focus:bg-primary focus:outline-none",
        header.column.getIsResizing()
          ? "bg-primary"
          : "opacity-0 hover:opacity-100"
      )}
      onDoubleClick={onDoubleClick}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
}
