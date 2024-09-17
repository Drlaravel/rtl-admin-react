import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableComponent from '../../components/TableComponent/TableComponent';
import Pagination from '../../components/Pagination/Pagination';
import api from '../../api/api'; // استفاده از ماژول api برای درخواست‌ها

const MySwal = withReactContent(Swal);

interface SmsLog {
  id: number;
  mobile: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  created_at: string;
  updated_at: string;
}

const SmsLogList: React.FC = () => {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  // تابع برای دریافت لاگ‌های پیامک از سرور
  const fetchLogs = useCallback(async (page = 1) => {
    try {
      const response = await api.get(`/api/sms/logs?page=${page}`);
      setLogs(response.data.data.data); // تنظیم داده‌های لاگ
      setPageCount(response.data.data.last_page); // تنظیم تعداد صفحات
      setCurrentPage(response.data.data.current_page - 1); // تنظیم صفحه جاری
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
      MySwal.fire('خطا!', 'دریافت لاگ‌های پیامک با مشکل مواجه شد.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // بارگذاری لاگ‌ها هنگام بارگیری کامپوننت یا تغییر صفحه
  useEffect(() => {
    fetchLogs(currentPage + 1);
  }, [fetchLogs, currentPage]);

  // تابع برای تغییر صفحه
  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <>
      <Breadcrumb pageName="لاگ‌های پیامک" />
      <div className="container">
        <div className="mt-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <TableComponent<SmsLog>
            headers={['ایدی', 'شماره موبایل', 'پیام', 'وضعیت', 'خطا', 'تاریخ ارسال']}
            data={logs.map((log) => ({
              id: log.id,
              mobile: log.mobile,
              message: log.message,
              status: log.status === 'sent' ? 'ارسال شده' : log.status === 'failed' ? 'ناموفق' : 'در حال ارسال',
              error: log.error || 'بدون خطا',
              created_at: new Date(log.created_at).toLocaleDateString('fa-IR'),
            }))}
          />

          {/* صفحه‌بندی */}
          <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default React.memo(SmsLogList);
