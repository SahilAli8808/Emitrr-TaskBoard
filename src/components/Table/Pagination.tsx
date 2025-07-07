import React from 'react';

interface PaginationProps {
  pagination: {
    currPage: number;
    setCurrPage: (page: number) => void;
    pages: number;
    pageNumbers: number[];
    prevPage: () => void;
    nextPage: () => void;
    topIndex: number;
    bottomIndex: number;
  };
  rows: any[];
  i?: number;
  query: string;
}

interface ButtonProps {
  pageNum: number | string;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, rows, i, query }) => {
  const { currPage, setCurrPage, pages, pageNumbers, prevPage, nextPage, topIndex, bottomIndex } = pagination;

  if (pages <= 1 || query !== '') return null;

  const Button: React.FC<ButtonProps> = ({ pageNum, disabled = false }) => (
    <button
      disabled={disabled}
      style={{ border: '1px solid grey' }}
      className={`px-3 py-2 ${
        pageNum === currPage ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white-200 hover:bg-indigo-100 hover:cursor-pointer'
      }`}
      onClick={() => typeof pageNum === 'number' && setCurrPage(pageNum)}
    >
      {pageNum}
    </button>
  );

  const PageMenu: React.FC = () => {
    if (pageNumbers.length < 10) {
      return (
        <>
          {pageNumbers.map((pageNum) => (
            <Button key={pageNum} pageNum={pageNum} />
          ))}
        </>
      );
    } else {
      return (
        <>
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === Math.floor(pageNumbers.length / 2)) {
              return <Button key={`ellipsis-${index}`} pageNum="..." disabled={true} />;
            } else if (
              index < 2 ||
              index > pageNumbers.length - 3 ||
              pageNum === currPage + 1 ||
              pageNum === currPage ||
              pageNum === currPage - 1
            ) {
              return <Button key={pageNum} pageNum={pageNum} />;
            }
            return null;
          })}
        </>
      );
    }
  };

  return (
    <div className="grid grid-cols-2 mt-4 text-[0.8rem] w-full">
      <div className="pb-2 col-span-2 mx-auto sm:mx-0 sm:col-span-1 sm:col-start-1">
        Showing {topIndex + 1} to {Math.min(bottomIndex, rows.length)} of {rows.length} entries
      </div>
      <div className="pb-2 col-span-2 mx-auto sm:mx-0 sm:col-span-1 sm:col-end-4">
        <button
          style={{ border: '1px solid grey' }}
          className={`${
            currPage === 1 ? 'cursor-default hover:bg-gray-200' : 'hover:bg-indigo-400 hover:cursor-pointer'
          } text-gray-800 py-2 px-4 rounded-l`}
          onClick={prevPage}
          disabled={currPage === 1}
        >
          Prev
        </button>
        <PageMenu />
        <button
          style={{ border: '1px solid grey' }}
          className={`${
            currPage === pages ? 'cursor-default hover:bg-gray-200' : 'hover:bg-indigo-400 hover:cursor-pointer'
          } text-gray-800 py-2 px-4 rounded-r`}
          onClick={nextPage}
          disabled={currPage === pages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
