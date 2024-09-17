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
    <div className='my-5 flex cursor-pointer items-center justify-center rounded-md p-1 px-2'>
     
    
      <ReactPaginate
      previousLabel={<svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z" fill=""></path></svg>}
      nextLabel={<svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z" fill=""></path></svg>}
      breakLabel={'...'}
      breakClassName={'datatable-pagination-list-item datatable-disabled'}
      pageCount={pageCount}
      forcePage={currentPage}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={onPageChange}
      containerClassName={'datatable-pagination-list flex items-center justifyCenter gap-3'}
      pageClassName={'datatable-pagination-list-item '}
      pageLinkClassName={'datatable-pagination-list-item-link  text-black dark:text-white  flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white'}
      previousClassName={'datatable-pagination-list-item text-primary'}
      nextClassName={'datatable-pagination-list-item text-primary'}
      activeClassName={'datatable-active bg-primary rounded-md'}
      disabledClassName={'datatable-hidden datatable-disabled text-white'}
    />
    
    </div>
  );
};

export default React.memo(Pagination);
