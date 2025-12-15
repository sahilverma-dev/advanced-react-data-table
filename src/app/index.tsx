import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Checkbox } from "@/components/ui/checkbox";
import { generateData, type Person } from "@/data";
import { useDataTable } from "@/hooks/use-data-table";

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.accessor("id", {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 50,
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
  }),
  columnHelper.accessor("age", {
    header: "Age",
  }),
  columnHelper.accessor("visits", {
    header: "Visits",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
  }),
];

const users = generateData(10000);

const App = () => {
  const { table } = useDataTable({
    data: users,
    columns,
    pageCount: 1,
  });

  return (
    <div className="p-4">
      <DataTable table={table} height="500px">
        <DataTableToolbar table={table}>hello</DataTableToolbar>
      </DataTable>
    </div>
  );
};

export default App;
