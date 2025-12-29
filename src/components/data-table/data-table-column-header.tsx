"use client";

import { useQueryState } from "nuqs";
import { getFiltersStateParser } from "@/lib/parsers";
import { DataTableFilterInput } from "@/components/data-table/data-table-filter-input";
import { getDefaultFilterOperator } from "@/lib/data-table";
import { generateId } from "@/lib/id";
import type { ExtendedColumnFilter } from "@/types/data-table";
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
  ChevronsUpDownIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";

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

  if (column.columnDef.meta?.headerVariant === "minimal") {
    return (
      <div className={cn("flex h-8 w-full items-center", className)}>
        <span className="truncate text-xs font-medium text-muted-foreground/70">
          {label}
        </span>
      </div>
    );
  }

  if (
    column.columnDef.meta?.headerVariant === "simple" ||
    column.columnDef.meta?.headerVariant === "label-only"
  ) {
    return (
      <div className={cn("group flex h-8 items-center text-xs", className)}>
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
    <div className={cn("flex group items-center gap-2 w-full", className)}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-full text-left justify-between items-center data-[state=open]:bg-accent",
              isAnyColumnResizing && "pointer-events-none"
            )}
            onPointerDown={onTriggerPointerDown}
            {...props}
          >
            {columnVariant && (
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <columnVariant.icon className="mr-2 size-3.5 shrink-0 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{columnVariant.label}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <span className="truncate">{label}</span>
            {column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={0} className="w-60">
          {column.getCanFilter() && (
            <>
              <DataTableColumnFilter header={header} table={table} />
              {column.getCanSort() && <DropdownMenuSeparator />}
            </>
          )}
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
    </div>
  );
}

function DataTableColumnFilter<TData, TValue>({
  header,
  table,
}: {
  header: Header<TData, TValue>;
  table: Table<TData>;
}) {
  const column = header.column;
  const columnMeta = column.columnDef.meta;
  const variant = columnMeta?.variant ?? "text";

  const [filters, setFilters] = useQueryState(
    table.options.meta?.queryKeys?.filters ?? "filters",
    getFiltersStateParser<TData>(
      table
        .getAllColumns()
        .filter((column) => column.columnDef.enableColumnFilter)
        .map((column) => column.id)
    )
      .withDefault([])
      .withOptions({
        shallow: false,
        throttleMs: 1000,
      })
  );

  const filter = React.useMemo(() => {
    return (
      filters.find((f) => f.id === column.id) ??
      ({
        id: column.id as Extract<keyof TData, string>,
        value: "",
        variant: variant,
        operator: getDefaultFilterOperator(variant),
        filterId: generateId({ length: 8 }),
      } as ExtendedColumnFilter<TData>)
    );
  }, [filters, column.id, variant]);

  const [value, setValue] = React.useState(filter.value);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  // Sync state with global filters
  React.useEffect(() => {
    setValue(filter.value);
  }, [filter.value]);

  const onFilterUpdate = React.useCallback(
    (
      _: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
    ) => {
      setFilters((prev) => {
        const existingIndex = prev.findIndex((f) => f.id === column.id);

        if (existingIndex > -1) {
          // Update existing
          const newFilters = [...prev];
          // If value is empty or undefined, remove the filter
          if (
            updates.value === undefined ||
            updates.value === "" ||
            (Array.isArray(updates.value) && updates.value.length === 0)
          ) {
            newFilters.splice(existingIndex, 1);
            return newFilters;
          }
          newFilters[existingIndex] = { ...prev[existingIndex], ...updates };
          return newFilters;
        } else {
          // Add new
          // If value is empty, don't add
          if (
            updates.value === undefined ||
            updates.value === "" ||
            (Array.isArray(updates.value) && updates.value.length === 0)
          ) {
            return prev;
          }
          return [...prev, { ...filter, ...updates }];
        }
      });
    },
    [column.id, filter, setFilters]
  );

  // Custom Reset Handler to force remove from global state
  const onReset = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setFilters((prev) => prev.filter((f) => f.id !== column.id));
    },
    [column.id, setFilters]
  );

  return (
    <div className="p-2 space-y-2">
      <DataTableFilterInput
        filter={{ ...filter, value }} // Pass local value for immediate feedback if needed, but we rely on nuqs mainly. Actually for inputs we might want controlled local state? `DataTableFilterInput` uses the value from filter prop.
        // `DataTableFilterInput` calls `onFilterUpdate`.
        // If we want immediate feedback in input, we might need to rely on `filters` update or local state.
        // `nuqs` update might be debounced or async.
        // Let's pass the computed `filter` which derives from `filters` state.
        // But `filters` is from `useQueryState`.
        // `DataTableFilterInput` in `data-table-filter-list` was using `filters` from `useQueryState` which was debounced in the list component.
        // `useQueryState` returns the current state. `setFilters` updates it.
        // IF we want valid input behavior, `onFilterUpdate` should probably update `filters` immediately?
        // `getFiltersStateParser` options in `DataTableFilterList` had `throttleMs`.
        // Here I used `throttleMs: 1000`.

        inputId={`header-filter-${column.id}`}
        column={column}
        columnMeta={columnMeta}
        onFilterUpdate={onFilterUpdate}
        showValueSelector={showValueSelector}
        setShowValueSelector={setShowValueSelector}
      />
      {!!filter.value && (
        <div className="flex justify-end">
          <button
            className="text-xs text-destructive hover:text-destructive/50"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      )}
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
        "h-10 w-0.5 cursor-ew-resize touch-none select-none bg-primary transition-opacity after:absolute after:inset-y-0 after:start-1/2 after:h-full after:w-[18px] after:content-[''] hover:bg-primary focus:bg-primary focus:outline-none",
        header.column.getIsResizing()
          ? "bg-primary"
          : "opacity-0 group-hover:opacity-100"
      )}
      onDoubleClick={onDoubleClick}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
}
