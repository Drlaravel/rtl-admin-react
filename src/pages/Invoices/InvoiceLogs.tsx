import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Log {
  id: number;
  payment_id: number;
  user_id: number;
  user_ip: string;
  action: string;
  data: string;
}

const InvoiceLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const navigate = useNavigate();

  const showAlert = useCallback(
    (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
      return MySwal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        confirmButtonColor: '#3085d6',
      });
    },
    []
  );

  const fetchLogs = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get(`/api/payemnt-logs?page=${page}`);
        if (response.data && Array.isArray(response.data.data)) {
            console.log(response.data)
          setLogs(response.data.data);
          setPageCount(response.data.last_page); // تنظیم تعداد صفحات صحیح
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        showAlert('خطا!', 'دریافت لاگ‌ها با مشکل مواجه شد.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  useEffect(() => {
    fetchLogs(currentPage + 1); // بارگذاری لاگ‌ها بر اساس صفحه جاری
  }, [fetchLogs, currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
  };

  
  

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="log-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست لاگ‌ها</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className={`font-medium`}>
                داشبورد
              </NavLink>
            </li>
            <li>
              <NavLink to="/logs" className={`font-medium`}>
                لاگ‌ها
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className={`font-medium text-primary`}>
                لیست لاگ‌ها
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>

      <TableComponent<Log>
        headers={['ایدی', 'شناسه پرداخت', 'شناسه کاربر', 'IP کاربر', 'عملیات', 'داده']}
        data={logs.map((log) => ({
          id: log.id,
          payment_id: log.payment_id,
          user_id: log.user_id,
          user_ip: log.user_ip,
          action: log.action,
          data: log.data,
        }))}
       
      />

      {/* Pagination */}
      <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default React.memo(InvoiceLogs);
