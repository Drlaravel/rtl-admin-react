// components/Pagination.tsx
import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pageCount: number; // تعداد کل صفحات
  currentPage: number; // شماره صفحه فعلی
  onPageChange: (selectedPage: { selected: number }) => void; // تابعی که هنگام تغییر صفحه فراخوانی می‌شود
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, currentPage, onPageChange }) => {
  // اگر تعداد صفحات کمتر از 2 باشد، کامپوننت نمایش داده نمی‌شود
  if (pageCount < 2) return null;

  return (
    <ReactPaginate
      previousLabel={'‹'}
      nextLabel={'›'}
      breakLabel={'...'}
      breakClassName={'datatable-pagination-list-item datatable-disabled'}
      pageCount={pageCount}
      forcePage={currentPage}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={'datatable-pagination-list'}
      pageClassName={'datatable-pagination-list-item'}
      pageLinkClassName={'datatable-pagination-list-item-link'}
      previousClassName={'datatable-pagination-list-item'}
      nextClassName={'datatable-pagination-list-item'}
      activeClassName={'datatable-active'}
      disabledClassName={'datatable-hidden datatable-disabled'}
    />
  );
};

export default React.memo(Pagination);
