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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
              "-ml-3 h-8 w-full text-left justify-between items-center data-[state=open]:bg-accent",
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
              <DataTableColumnFilter header={header} />
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

// Helpers for Number/Slider Filter
interface Range {
  min: number;
  max: number;
}
type RangeValue = [number, number];

function getIsValidRange(value: unknown): value is RangeValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

function parseValuesAsNumbers(value: unknown): RangeValue | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (v) =>
        (typeof v === "string" || typeof v === "number") && !Number.isNaN(v)
    )
  ) {
    return [Number(value[0]), Number(value[1])];
  }
  return undefined;
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

  // --- Number / Range / Slider Logic ---
  const isNumberVariant = variant === "number" || variant === "range";
  const id = React.useId();
  const defaultRange = column.columnDef.meta?.range;
  const unit = column.columnDef.meta?.unit;

  // Memoize min/max/step calculation
  const { min, max, step } = React.useMemo<Range & { step: number }>(() => {
    if (!isNumberVariant) return { min: 0, max: 100, step: 1 };

    let minValue = 0;
    let maxValue = 100;

    if (defaultRange && getIsValidRange(defaultRange)) {
      [minValue, maxValue] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      if (values && Array.isArray(values) && values.length === 2) {
        const [facetMinValue, facetMaxValue] = values;
        if (
          typeof facetMinValue === "number" &&
          typeof facetMaxValue === "number"
        ) {
          minValue = facetMinValue;
          maxValue = facetMaxValue;
        }
      }
    }

    const rangeSize = maxValue - minValue;
    const step =
      rangeSize <= 20
        ? 1
        : rangeSize <= 100
        ? Math.ceil(rangeSize / 20)
        : Math.ceil(rangeSize / 50);

    return { min: minValue, max: maxValue, step };
  }, [column, defaultRange, isNumberVariant]);

  const rangeValue = React.useMemo((): RangeValue => {
    return (parseValuesAsNumbers(filterValue) ?? [min, max]) as RangeValue;
  }, [filterValue, min, max]);

  if (isNumberVariant) {
    const onFromInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (
        !Number.isNaN(numValue) &&
        numValue >= min &&
        numValue <= rangeValue[1]
      ) {
        handleFilterChange([numValue, rangeValue[1]]);
      }
    };

    const onToInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (
        !Number.isNaN(numValue) &&
        numValue <= max &&
        numValue >= rangeValue[0]
      ) {
        handleFilterChange([rangeValue[0], numValue]);
      }
    };

    const onSliderValueChange = (val: number[]) => {
      if (Array.isArray(val) && val.length === 2) {
        handleFilterChange(val);
      }
    };

    return (
      <div className="p-2 space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor={`${id}-from`} className="sr-only">
            From
          </Label>
          <div className="relative">
            <Input
              id={`${id}-from`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              value={rangeValue[0]}
              onChange={onFromInputChange}
              className={cn("h-8 w-24", unit && "pr-8")}
            />
            {unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                {unit}
              </span>
            )}
          </div>
          <Label htmlFor={`${id}-to`} className="sr-only">
            To
          </Label>
          <div className="relative">
            <Input
              id={`${id}-to`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              value={rangeValue[1]}
              onChange={onToInputChange}
              className={cn("h-8 w-24", unit && "pr-8")}
            />
            {unit && (
              <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                {unit}
              </span>
            )}
          </div>
        </div>
        <Slider
          id={`${id}-slider`}
          min={min}
          max={max}
          step={step}
          value={rangeValue}
          onValueChange={onSliderValueChange}
        />
        <div className="flex justify-end">
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              handleFilterChange(undefined);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // --- Date Range / Date Logic ---
  if (variant === "dateRange" || variant === "date") {
    return (
      <div className="p-2 space-y-2">
        <Tabs
          defaultValue={variant === "date" ? "single" : "range"}
          className="w-[250px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="range">Range</TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="mt-2">
            <Calendar
              mode="single"
              initialFocus
              selected={
                Array.isArray(value) && value[0]
                  ? new Date(value[0])
                  : undefined
              }
              onSelect={(val) => {
                if (val) {
                  const iso = val.toISOString();
                  handleFilterChange([iso, iso]);
                } else {
                  handleFilterChange(undefined);
                }
              }}
            />
          </TabsContent>
          <TabsContent value="range" className="mt-2">
            <Calendar
              mode="range"
              selected={
                Array.isArray(value) && value.length === 2
                  ? {
                      from: value[0] ? new Date(value[0]) : undefined,
                      to: value[1] ? new Date(value[1]) : undefined,
                    }
                  : undefined
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
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              handleFilterChange(undefined);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // --- Multi-select / Select / Boolean (Faceted) Logic ---
  const options = column.columnDef.meta?.options ?? [];
  const isMulti = variant === "multiSelect";

  // Use Command list for select/multiselect
  if (options.length > 0) {
    return (
      <div className="w-full group">
        <Command>
          <CommandInput placeholder="Search..." autoFocus />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {options.map((option) => {
                const isSelected = isMulti
                  ? Array.isArray(value) &&
                    (value as string[]).includes(option.value)
                  : value === option.value;

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isMulti) {
                        const current = Array.isArray(value)
                          ? (value as string[])
                          : [];
                        const next = current.includes(option.value)
                          ? current.filter((v) => v !== option.value)
                          : [...current, option.value];

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
                    <span className="truncate">{option.label}</span>
                    {option.count && (
                      <span className="ml-auto font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {!!value && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleFilterChange(undefined)}
                    className="justify-center text-center font-medium text-muted-foreground"
                  >
                    Reset filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </div>
    );
  }

  // --- Default Text Filter ---
  return (
    <div className="p-2 space-y-2">
      <Input
        placeholder={`Search ${
          column.columnDef.meta?.label?.toLowerCase() ?? "values"
        }...`}
        value={(value as string) ?? ""}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="h-8"
        autoFocus
      />
      {!!value && (
        <div className="flex justify-end">
          <button
            className="text-xs text-destructive hover:text-destructive/50"
            onClick={(e) => {
              e.stopPropagation();
              handleFilterChange(undefined);
            }}
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
