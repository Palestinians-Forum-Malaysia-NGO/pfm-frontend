import DataTable from "./DataTable";

/**
 * SimpleDataTable — DataTable without checkbox selection column.
 * Accepts all the same props as DataTable except `selectable` (always false).
 */
const SimpleDataTable = ({ selectable: _ignored, ...props }) => (
  <DataTable {...props} selectable={false} />
);

export default SimpleDataTable;
