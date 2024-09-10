import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Payment {
  title: string;
  amount: number;
  status: 'paid' | 'pending' | 'rejected';
  payment_date: string;
}

interface Domain {
  name: string;
  expiry_date: string;
  reminder_date: string;
  purchase_type: 'ours' | 'customer';
}

interface Host {
  purchase_type: 'ours' | 'customer';
  username?: string;
  password?: string;
  host_link?: string;
  expiry_date?: string;
  reminder_date?: string;
  host_space?: string;
  host_price?: number;
  host_company_name?: string;
}
interface Support {
  duration: '6_months' | '12_months';
  price?: number;
  details?: string;
}

interface FormData {
  name: string;
  status: 'start' | 'prepayment' | 'design' | 'demo' | 'learn' | 'completed';
  employer: string;
  contact_number: string;
  username: string;
  password: string;
  client_type: 'individual' | 'corporate';
  company_name?: string;
  start_date: string;
  end_date: string;
  price: number;
  payments: Payment[];
  domains: Domain[];
  host: Host;
  support: Support;
}

const ProjectAdd: React.FC = () => {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      status: 'start',
      employer: '',
      contact_number: '',
      username: '',
      password: '',
      client_type: 'individual',
      start_date: '',
      end_date: '',
      price: 0,
      payments: [],
      domains: [],
      host: { purchase_type: 'ours' }
    },
  });

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control,
    name: 'payments'
  });

  const { fields: domainFields, append: appendDomain, remove: removeDomain } = useFieldArray({
    control,
    name: 'domains'
  });

  const [currentPage, setCurrentPage] = useState(1); // مدیریت صفحه فعلی
  const clientType = watch('client_type'); // نظارت بر تغییرات نوع مشتری
  const hostType = watch('host.purchase_type');
  const onSubmit = (data: FormData) => {
    if (currentPage === 1) {
      // اگر در صفحه اول هستید، اعتبارسنجی‌ها را چک کنید و به صفحه بعد بروید
      if (Object.keys(errors).length === 0) {
        setCurrentPage(2);
      }
    } else {
      // اگر در صفحه دوم هستید، فرم را ارسال کنید
      console.log('Form Data Submitted:', data);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Project Form" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Project Form</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6.5">
            {/* صفحه اول */}
            {currentPage === 1 && (
              <>
                {/* اطلاعات پروژه */}
                
                
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  صفحه‌ی بعدی
                </button>
              </>
            )}

            {currentPage === 2 && (
              <>
                



                

                




                {/* دکمه‌های ارسال و بازگشت */}
                <div className='flex gap-4'>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="flex w-full justify-center rounded bg-orange-500 p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    بازگشت به صفحه قبل
                  </button>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    ارسال فرم
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProjectAdd;
