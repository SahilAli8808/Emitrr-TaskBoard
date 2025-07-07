import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Row = Record<string, any>;

interface Header {
  accessor: string;
  title?: string;
}

// useSearch Hook
export function useSearch() {
  const [query, setQuery] = useState<string>("");

  function search(item: Row): boolean {
    const lowerCaseQuery = query.toLowerCase().trim();

    function searchRecursive(obj: any): boolean {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === "string" || typeof value === "number") {
            if (
              value.toString().toLowerCase().includes(lowerCaseQuery) ||
              (key === "status" &&
                value.toString().toLowerCase().includes(lowerCaseQuery))
            ) {
              return true;
            }
          } else if (Array.isArray(value)) {
            for (const element of value) {
              if (searchRecursive(element)) {
                return true;
              }
            }
          } else if (typeof value === "object" && value !== null) {
            if (searchRecursive(value)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    return searchRecursive(item);
  }

  return { query, setQuery, search };
}

// usePagination Hook
export function usePagination<T>(rows: T[]) {
  const [currPage, setCurrPage] = useState<number>(1);
  const [entries, setEntries] = useState<number>(10);

  const bottomIndex = currPage * entries;
  const topIndex = bottomIndex - entries;
  const records = rows.slice(topIndex, bottomIndex);
  const pages = Math.ceil(rows.length / entries);
  const pageNumbers = [...Array(pages + 1).keys()].slice(1);

  function prevPage() {
    if (currPage > 1) {
      setCurrPage((prev) => prev - 1);
    }
  }

  function nextPage() {
    if (currPage < pages) {
      setCurrPage((prev) => prev + 1);
    }
  }

  return {
    currPage,
    setCurrPage,
    entries,
    setEntries,
    records,
    pages,
    pageNumbers,
    prevPage,
    nextPage,
    bottomIndex,
    topIndex,
  };
}

// useSorting Hook
type SortState = {
  columnToSort: string;
  direction: "asc" | "dsc";
};

export function useSorting<T extends Row>() {
  const [sort, setSort] = useState<SortState>({
    columnToSort: "",
    direction: "asc",
  });

  function handleColumnClick(header: Header, rows: T[]) {
    const accessor = header.accessor;

    setSort((prev) => ({
      columnToSort: accessor,
      direction:
        prev.columnToSort === accessor && prev.direction === "asc"
          ? "dsc"
          : "asc",
    }));
  }

  function sortArray(rows: T[]): T[] {
    const sorted = [...rows];
    return sorted.sort((a, b) => {
      const aValue = a[sort.columnToSort];
      const bValue = b[sort.columnToSort];

      if (aValue === undefined || bValue === undefined) return 0;

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }

  return { sort, handleColumnClick, sortArray };
}

// useNavigate Hook
export function useNavigateHook() {
  const navigate = useNavigate();

  function handleClick(path: string) {
    navigate(path);
  }

  return handleClick;
}
