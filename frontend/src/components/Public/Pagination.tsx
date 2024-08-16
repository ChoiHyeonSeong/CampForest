import React, { useState, useEffect } from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const [maxVisiblePages, setMaxVisiblePages] = useState(10);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMaxVisiblePages(10); // 데스크탑
      } else if (window.innerWidth >= 768) {
        setMaxVisiblePages(5); // 태블릿
      } else {
        setMaxVisiblePages(3); // 모바일
      }
    };

    handleResize(); // 초기 설정
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-light-gray text-light-gray-3 dark:bg-dark-gray dark:text-dark-gray-3 disabled:opacity-50"
      >
        이전
      </button>
      
      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded ${
            currentPage === pageNumber ? 'bg-light-anchor text-light-white dark:bg-dark-anchor dark:text-dark-white' : 'bg-light-gray text-light-gray-3 dark:bg-dark-gray dark:text-dark-gray-3'
          }`}
        >
          {pageNumber}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-light-gray text-light-gray-3 dark:bg-dark-gray dark:text-dark-gray-3 disabled:opacity-50"
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;