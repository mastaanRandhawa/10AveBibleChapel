import React from "react";
import "./Table.css";

interface TableColumn {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  renderRow,
  emptyMessage = "No data available",
  className = "",
}) => {
  if (data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table-header-cell table-align-${column.align || "left"}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

