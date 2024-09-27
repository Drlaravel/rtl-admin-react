import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/api'; // اتصال به API

interface Payment {
  id: number;
  title: string;
  amount: string;
  status: 'paid' | 'pending' | 'rejected';
  payment_type: 'cash' | 'check' | 'installment';
  due_date: string | null;
  created_at: string;
}

const TableOne: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // درخواست به API برای دریافت فاکتورها
  const fetchPayments = useCallback(async () => {
    try {
      const response = await api.get('/api/payments');

      setPayments(response.data.data.data); // فرض می‌کنیم که داده‌ها در فیلد `data` هستند
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        لیست فاکتورها
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">عنوان</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">مبلغ</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">وضعیت</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">نوع پرداخت</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">تاریخ سررسید</h5>
          </div>
        </div>

        {payments.map((payment) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark`}
            key={payment.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{payment.title}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {new Intl.NumberFormat().format(Number(payment.amount))} تومان
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className={`text-${payment.status === 'paid' ? 'green' : payment.status === 'pending' ? 'yellow' : 'red'}`}>
                {payment.status === 'paid' ? 'پرداخت شده' : payment.status === 'pending' ? 'در انتظار' : 'رد شده'}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {payment.payment_type === 'cash' ? 'نقدی' : payment.payment_type === 'check' ? 'چک' : 'قسطی'}
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{payment.due_date || 'نامشخص'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
