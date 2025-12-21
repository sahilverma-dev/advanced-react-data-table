import { Checkbox } from "@/components/ui/checkbox";
import type { CellContext } from "@tanstack/react-table";

const DataTableSelectAllRows = <TData, TValue>({
  table,
}: CellContext<TData, TValue>) => (
  <Checkbox
    checked={
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
  />
);

export default DataTableSelectAllRows;
