import LoadingSkeleton from './LoadingSkeleton';

export default function DataTable({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data found',
  emptyIcon,
}) {
  if (isLoading) {
    return <LoadingSkeleton variant="table" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass p-12 text-center">
        {emptyIcon && (
          <div className="flex justify-center mb-4 text-gray-300">
            {emptyIcon}
          </div>
        )}
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                className="hover:bg-gray-50/50 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
