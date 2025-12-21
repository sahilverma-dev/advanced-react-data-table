import { Checkbox } from "@/components/ui/checkbox";
import type { CellContext } from "@tanstack/react-table";

const DataTableSelectRow = <TData, TValue>({
  row,
}: CellContext<TData, TValue>) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Select row"
  />
);

export default DataTableSelectRow;
