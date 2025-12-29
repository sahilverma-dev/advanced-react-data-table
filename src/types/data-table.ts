/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnSort, Row, RowData } from "@tanstack/react-table";
import type { DataTableConfig } from "@/config/data-table";
import type { FilterItemSchema } from "@/lib/parsers";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    queryKeys?: QueryKeys;
    onColumnClick?: (columnId: string) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    headerVariant?: "simple" | "default";
    variant?: FilterVariant;
    options?: Option[];
    range?: [number, number];
    unit?: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    cell?: CellOpts;
  }
}

export interface QueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
  search: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}

export interface CellSelectOption {
  label: string;
  value: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  count?: number;
}

export type CellOpts =
  | {
      variant: "short-text";
    }
  | {
      variant: "long-text";
    }
  | {
      variant: "number";
      min?: number;
      max?: number;
      step?: number;
    }
  | {
      variant: "select";
      options: CellSelectOption[];
    }
  | {
      variant: "multi-select";
      options: CellSelectOption[];
    }
  | {
      variant: "checkbox";
    }
  | {
      variant: "date";
    }
  | {
      variant: "url";
    }
  | {
      variant: "file";
      maxFileSize?: number;
      maxFiles?: number;
      accept?: string;
      multiple?: boolean;
    };
