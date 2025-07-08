import React from "react";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Loader2 } from "../Loader";
import { useSearch, usePagination, useSorting } from "./tableFunctions";
import Pagination from "./Pagination";

type Action = {
  label: string;
  onClick: (row: RowType) => void;
  icon?: React.ReactNode;
  className?: string;
};

type HeaderType = {
  accessor: string;
  title: string;
};

type RowType = Record<string, any>;

interface TableProps {
  rows: RowType[];
  headers: HeaderType[];
  actions?: Action[];
  loading: boolean;
  rowPath?: string;
  showPagination?: boolean;
  showSearch?: boolean;
}

const Table: React.FC<TableProps> = ({
  rows,
  headers,
  actions = [],
  loading,
  rowPath,
  showPagination = true,
  showSearch = true,
}) => {
  const { query, setQuery, search } = useSearch();
  const { sort, handleColumnClick, sortArray } = useSorting();
  const pagination = usePagination(sortArray(searchTable()));

  function searchTable(): RowType[] {
    if (!query) return rows;
    return rows.filter((item) => search(item));
  }

  return (
    <div className="p-4 bg-white rounded border shadow-sm border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        {showPagination && <Entries pagination={pagination} />}
        {showSearch && <SearchInput query={query} setQuery={setQuery} />}
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="py-2 px-4 border-b cursor-pointer whitespace-nowrap"
                  onClick={() => handleColumnClick(header, rows)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">{header.title}</span>
                    <span className="text-gray-500">
                      {sort.columnToSort === header.accessor ? (
                        sort.direction === "dsc" ? (
                          <FaArrowUpShortWide className="mt-1" />
                        ) : (
                          <FaArrowDownWideShort className="mt-1" />
                        )
                      ) : (
                        <PiArrowsDownUpBold className="mt-1" />
                      )}
                    </span>
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="py-2 px-4 border-b text-xs">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {pagination.records.length !== 0 && searchTable().length !== 0 ? (
              pagination.records.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-slate-50 transition border-b"
                >
                  {headers.map(({ accessor }, colIndex) =>
                    colIndex === 0 && rowPath ? (
                      <td
                        key={colIndex}
                        className="px-4 py-2 text-indigo-600 hover:underline"
                      >
                        <Link to={`${rowPath}/${row.id}`}>{row[accessor]}</Link>
                      </td>
                    ) : (
                      <td key={accessor} className="px-4 py-2 whitespace-nowrap">
                        {Array.isArray(row[accessor]) ? (
                          <TooltipDemo data={row[accessor]} />
                        ) : (
                          row[accessor]
                        )}
                      </td>
                    )
                  )}
                  {actions.length > 0 && (
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(row)}
                            className={`flex items-center space-x-1 text-sm ${action.className || ''}`}
                          >
                            {action.icon}
                            <span>{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-6"
                >
                  <Loader2
                    text="No record found"
                    loadText="Loading Data"
                    loading={loading}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <Pagination pagination={pagination} rows={rows} query={query} />
      )}
    </div>
  );
};

export default Table;

// Tooltip for array values
const TooltipDemo: React.FC<{ data: string[] }> = ({ data }) => {
  const short = data.join(", ").slice(0, 40);
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <p className="truncate max-w-[200px] cursor-default">{short}...</p>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-white p-2 text-sm shadow-lg rounded">
            <ul>
              {data.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const Entries: React.FC<{
  pagination: {
    entries: number;
    setEntries: React.Dispatch<React.SetStateAction<number>>;
    setCurrPage: React.Dispatch<React.SetStateAction<number>>;
  };
}> = ({ pagination }) => (
  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
    <label htmlFor="entries" className="text-sm">
      Show
    </label>
    <select
      id="entries"
      className="p-1 border rounded text-sm"
      value={pagination.entries}
      onChange={(e) => {
        pagination.setEntries(Number(e.target.value));
        pagination.setCurrPage(1);
      }}
    >
      {[5, 10, 25, 50, 100].map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
    <span className="text-sm">entries</span>
  </div>
);

const SearchInput: React.FC<{
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}> = ({ query, setQuery }) => (
  <div className="ml-auto">
    <label htmlFor="search" className="mr-2 text-sm">
      Search:
    </label>
    <input
      type="text"
      id="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="p-2 border rounded text-sm"
      placeholder="Search boards..."
    />
  </div>
);