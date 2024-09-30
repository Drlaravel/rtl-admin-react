// src/pages/PaymentList.tsx

import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api/api';
import { NavLink, useNavigate } from 'react-router-dom';
import TableComponent from '../../components/TableComponent/TableComponent';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import Pagination from '../../components/Pagination/Pagination';

const MySwal = withReactContent(Swal);

interface Payment {
  id: number;
  project_id: number | null;
  host_id: number | null;
  domain_id: number | null;
  support_id: number | null;
  amount: string;
  title: string;
  date: string | null;
  authority: string | null;
  status: 'paid' | 'pending' | 'rejected';
  payment_type: 'cash' | 'check' | 'installment';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  project: {
    id: number;
    name: string;
  } | null;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
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

  const fetchPayments = useCallback(
    async (page = 1) => {
      try {
        const response = await api.get(`/api/payments?page=${page}`);
        setPayments(response.data.data.data);
        setPageCount(response.data.data.last_page); // تنظیم تعداد صفحات صحیح
      } catch (error) {
        console.error('Error fetching payments:', error);
        showAlert('خطا!', 'دریافت پرداخت‌ها با مشکل مواجه شد.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showAlert]
  );

  useEffect(() => {
    fetchPayments(currentPage + 1); // بارگذاری پرداخت‌ها بر اساس صفحه جاری
  }, [fetchPayments, currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected); // تنظیم شماره صفحه فعلی
  };

  const handleDelete = useCallback(
    (paymentId: number) => {
      MySwal.fire({
        title: 'آیا از حذف این پرداخت مطمئن هستید؟',
        text: 'این عملیات قابل بازگشت نیست!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'بله، حذف کن!',
        cancelButtonText: 'انصراف',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await api.delete(`/api/payments/${paymentId}`);
            setPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== paymentId));
            showAlert('حذف شد!', 'پرداخت با موفقیت حذف شد.', 'success');
          } catch (error) {
            console.error('Error deleting payment:', error);
            showAlert('خطا!', 'حذف پرداخت با مشکل مواجه شد.', 'error');
          }
        }
      });
    },
    [showAlert]
  );

  const handleDetails = (paymentId: number) => {
    console.log('Navigating to edit payment with ID:', paymentId);
     navigate(`/admin/invoices/edit/${paymentId}`);
  };

  const handleViewInvoice = (paymentId: number) => {
    console.log('Viewing invoice for payment ID:', paymentId);
     navigate(`/admin/invoices/view/${paymentId}`);
  };

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="payment-list">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">لیست پرداخت‌ها</h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <NavLink to="/" className={`font-medium`}>
                داشبورد
              </NavLink>
            </li>
            <li>
              <NavLink to="/payments" className={`font-medium`}>
                پرداخت‌ها
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className={`font-medium text-primary`}>
                لیست پرداخت‌ها
              </NavLink>
            </li>
          </ol>
        </nav>
      </div>

      <TableComponent<Payment>
        headers={['ایدی','عنوان', 'مبلغ', 'تاریخ', 'وضعیت', 'نوع پرداخت', 'پروژه', 'تاریخ سررسید']}
        data={payments.map((payment) => ({
          id: payment.id,
          title: payment.title,
          amount: `${new Intl.NumberFormat().format(Number(payment.amount))} تومان`,
          date: payment.date || 'نامشخص',
          status: payment.status === 'paid' ? 'پرداخت شده' : payment.status === 'pending' ? 'در انتظار' : 'رد شده',
          payment_type: payment.payment_type === 'cash' ? 'نقدی' : payment.payment_type === 'check' ? 'چک' : 'قسطی',
          project_name: payment.project ? payment.project.name : 'بدون پروژه',
          due_date:  payment.due_date || 'نامشخص',
        }))}
        renderActions={(payment) => (
          <DropdownMenu
            actions={[
              { label: 'جزئیات', onClick: () => handleDetails(payment.id), className: '' },
              { label: 'فاکتور', onClick: () => handleViewInvoice(payment.id), className: '' },
              { label: 'حذف', onClick: () => handleDelete(payment.id), className: 'text-red-500' },
            ]}
          />
        )}
      />

      {/* Pagination */}
      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default React.memo(PaymentList);
