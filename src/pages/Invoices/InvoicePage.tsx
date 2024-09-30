// src/pages/InvoicePage/InvoicePage.tsx
import React, { useEffect, useState } from 'react';
import api from '../../api/api'; // درخواست‌های API
import { useParams } from 'react-router-dom'; // برای گرفتن شناسه فاکتور

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  [key: string]: any;
}

interface Project {
  id: number;
  name: string;
  user_id: number;
  user?: User;
  [key: string]: any;
}

interface Payment {
  id: number;
  amount: string;
  date: string;
  due_date: string;
  status: string;
  payment_type: string;
  project?: Project;
  user?: User;
  [key: string]: any;
}

const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // گرفتن شناسه فاکتور از پارامترهای آدرس
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await api.get(`/api/invoice/${id}`);
        console.log(response.data); // بررسی اطلاعات دریافتی
        setPayment(response.data);
      } catch (error) {
        console.error('Error fetching payment:', error);
      }
    };

    fetchPayment();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.location.href = `/api/invoice/download/${id}`; // مسیر API برای دانلود PDF
  };

  if (!payment) {
    return <div>در حال بارگذاری...</div>;
  }

  // استخراج اطلاعات کاربر
  const user = payment.user || payment.project?.user;
  return (
    <div className="invoice mb-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-4 py-4 dark:border-strokedark sm:px-6 xl:px-9">
        <h3 className="font-medium text-black dark:text-white">فاکتور</h3>
      </div>

      <div className="p-4 sm:p-6 xl:p-9">
        <div className="buttons mb-10 flex flex-wrap items-center justify-start gap-3.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2.5 rounded bg-meta-3 px-4 py-[7px] font-medium text-white hover:bg-opacity-90"
          >
            پرینت
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2.5 rounded bg-primary px-4 py-[7px] font-medium text-white hover:bg-opacity-90"
          >
            ذخیره به عنوان PDF
          </button>
        </div>

        <div className="flex flex-wrap justify-between gap-5">
          <div className="text-right">
            <p className="mb-1.5 font-medium text-black dark:text-white">صورتحساب برای:</p>
            <h4 className="mb-3 text-xl font-bold text-black dark:text-white">{payment.user?.name || 'نام مشتری'}</h4>
            <span className="mt-1.5 block">
              <span className="font-medium text-black dark:text-white">ایمیل:</span> {payment.user?.email || 'ایمیل مشتری'}
            </span>
            <span className="mt-1.5 block">
              <span className="font-medium text-black dark:text-white">تلفن:</span> {payment.user?.mobile || 'شماره مشتری'}
            </span>
          </div>
        </div>

        <div className="my-7.5 grid grid-cols-1 border border-stroke dark:border-strokedark xsm:grid-cols-2 sm:grid-cols-4">
          <div className="border-b border-r border-stroke px-5 py-4 last:border-r-0 dark:border-strokedark sm:border-b-0">
            <h5 className="mb-1.5 font-bold text-black dark:text-white">شناسه فاکتور :</h5>
            <span className="text-sm font-medium">#{payment.id}</span>
          </div>

          <div className="border-b border-r border-stroke px-5 py-4 last:border-r-0 dark:border-strokedark sm:border-b-0">
            <h5 className="mb-1.5 font-bold text-black dark:text-white">تاریخ صدور :</h5>
            <span className="text-sm font-medium">{payment.date}</span>
          </div>

          <div className="border-b border-r border-stroke px-5 py-4 last:border-r-0 dark:border-strokedark sm:border-b-0">
            <h5 className="mb-1.5 font-bold text-black dark:text-white">تاریخ انقضا :</h5>
            <span className="text-sm font-medium">{payment.due_date}</span>
          </div>

          <div className="border-b border-r border-stroke px-5 py-4 last:border-r-0 dark:border-strokedark xsm:border-b-0">
            <h5 className="mb-1.5 font-bold text-black dark:text-white">مبلغ قابل پرداخت :</h5>
            <span className="text-sm font-medium">
  {new Intl.NumberFormat().format(Number(payment.amount))} تومان
</span>

          </div>
        </div>

        <div className="border border-stroke dark:border-strokedark">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[670px]">
              <div className="grid grid-cols-12 border-b border-stroke py-3.5 pl-5 pr-6 dark:border-strokedark">
                <div className="col-span-6">
                  <h5 className="font-medium text-black dark:text-white">شرح</h5>
                </div>

                <div className="col-span-3">
                  <h5 className="font-medium text-black dark:text-white">مبلغ</h5>
                </div>

                <div className="col-span-3">
                  <h5 className="font-medium text-black dark:text-white">وضعیت</h5>
                </div>
              </div>

              <div className="grid grid-cols-12 border-b border-stroke py-3.5 pl-5 pr-6 dark:border-strokedark">
                <div className="col-span-6">
                  <p className="font-medium">
                    {payment.project ? `پروژه: ${payment.project.name}` : payment.domain ? `دامنه: ${payment.domain.name}` : payment.host ? `هاست: ${payment.host.name}` : payment.support ? `پشتیبانی: ${payment.support.status}` : '---'}
                  </p>
                </div>

                <div className="col-span-3">
                  <p className="font-medium">{new Intl.NumberFormat().format(Number(payment.amount))} تومان</p>
                </div>

                <div className="col-span-3">
                  <p className="font-medium">{payment.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-6">
            <div className="w-full max-w-65">
              <p className="flex justify-between border-t border-stroke pt-5 dark:border-strokedark">
                <span className="font-medium text-black dark:text-white">مجموع کل</span>
                <span className="font-bold text-meta-3">{new Intl.NumberFormat().format(Number(payment.amount))} تومان</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
