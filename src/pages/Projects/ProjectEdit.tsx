import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/api';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate, useParams } from 'react-router-dom';

const MySwal = withReactContent(Swal);

interface Payment {
    title: string;
    amount: number;
    status: 'paid' | 'pending' | 'rejected';
    date: string;
    due_date: string;
    expiry_date: string;
}

interface Domain {
    name: string;
    expiry_date: string;
    reminder_date: string;
    purchase_type: 'ours' | 'customer';
    status: 'yes' | 'no';
    purchase_site_username?: string;
    purchase_site_password?: string;
    purchase_site_url?: string;
}

interface Host {
    purchase_type: 'ours' | 'customer';
    username?: string;
    password?: string;
    link?: string;
    expiry_date?: string;
    reminder_date?: string;
    space?: string;
    price?: number;
    company_name?: string;
}

interface Support {
    duration: '6months' | '12months';
    price?: number;
    status: 'yes' | 'no';
}

interface FormData {
    name: string;
    status: 'start' | 'prepayment' | 'design' | 'demo' | 'learn' | 'completed';
    employer: string;
    contact_number: string;
    username: string;
    password: string;
    client_type: 'individual' | 'corporate';
    type: 'bronze' | 'silver' | 'gold';
    company_name?: string;
    start_date: string;
    end_date: string;
    price: number;
    payments: Payment[];
    domains: Domain[];
    host: Host;
    support: Support | null;
    details?: string;
}

const showAlert = (title: string, text: string, icon: 'success' | 'error', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
};

const ProjectEdit: React.FC = () => {
    const navigate = useNavigate();

    // Define state for all the date fields
    const [startDate, setStartDate] = useState<string | null>(null);
    const [details, setDetails] = useState<string>('');
    const [endDate, setEndDate] = useState<string | null>(null);
    const [paymentDates, setPaymentDates] = useState<string[]>([]);
    const [dueDates, setDueDates] = useState<string[]>([]);
    const [expiryDates, setExpiryDates] = useState<string[]>([]);
    const [domainExpiryDates, setDomainExpiryDates] = useState<string[]>([]);
    const [domainReminderDates, setDomainReminderDates] = useState<string[]>([]);
    const [hostExpiryDate, setHostExpiryDate] = useState<string | null>(null);
    const [hostReminderDate, setHostReminderDate] = useState<string | null>(null);

    const { projectId } = useParams<{ projectId: string }>();
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
            host: { purchase_type: 'ours' },
            support: { duration: '6months' },
        },
    });

    const { fields: paymentFields, replace: replacePayments } = useFieldArray({
        control,
        name: 'payments'
    });

    const { fields: domainFields, replace: replaceDomains } = useFieldArray({
        control,
        name: 'domains'
    });

    const [step, setStep] = useState<number>(1);
    const clientType = watch('client_type');
    const hostType = watch('host.purchase_type');

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await api.get(`/api/projects/${projectId}`);
                const projectData = response.data.data;
                console.log(projectData)
                // Setting values in the form
                setValue('name', projectData.name || '');
                setValue('status', projectData.status || 'start');
                setValue('employer', projectData.employer || '');
                setValue('contact_number', projectData.contact_number || '');

                if (projectData.user) {
                    setValue('username', projectData.user.email || '');
                    setValue('password', projectData.user.password || '');
                }

                setValue('client_type', projectData.client_type || 'individual');
                setValue('type', projectData.type || 'bronze');
                setValue('company_name', projectData.company_name || '');
                setValue('price', parseFloat(projectData.price) || 0);
                setValue('details', projectData.details || '');
                setDetails(projectData.details || '')
                setValue('support', projectData.support || { duration: '6months', status: 'no' });

                // Handling dates and setting them in the state
                setStartDate(projectData.start_date || '');
                setEndDate(projectData.end_date || '');

                if (Array.isArray(projectData.payments)) {
                    replacePayments(projectData.payments);
                    setPaymentDates(projectData.payments.map((payment: Payment) => payment.date || ''));
                    setDueDates(projectData.payments.map((payment: Payment) => payment.due_date || ''));
                    setExpiryDates(projectData.payments.map((payment: Payment) => payment.expiry_date || ''));
                }

                if (Array.isArray(projectData.domains)) {
                    replaceDomains(projectData.domains);
                    setDomainExpiryDates(projectData.domains.map((domain: Domain) => domain.expiry_date || ''));
                    setDomainReminderDates(projectData.domains.map((domain: Domain) => domain.reminder_date || ''));
                }

                if (projectData.host) {
                    setValue('host', projectData.host);

                }

                if (Array.isArray(projectData.host) && projectData.host.length > 0) {
                    setValue('host', projectData.host[0]);
                    setHostExpiryDate(projectData.host[0].expiry_date || '');
                    setHostReminderDate(projectData.host[0].reminder_date || '');
                }

            } catch (error) {
                console.error('Error fetching project data:', error);
                showAlert('خطا!', 'مشکل در دریافت داده‌های پروژه', 'error');
            }
        };

        fetchProjectData();
    }, [projectId, setValue, replacePayments, replaceDomains]);

    const onSubmit = async (data: FormData) => {
        if (step < 5) {
            setStep(prevStep => prevStep + 1);
        } else {
            try {
                const response = await api.put(`/api/projects/${projectId}`, {
                    ...data,
                    start_date: startDate,
                    end_date: endDate,
                    payments: data.payments.map((payment, index) => ({
                        ...payment,
                        payment_date: paymentDates[index]?? '',
                        due_date: dueDates[index] ?? '',
                        expiry_date: expiryDates[index]?? '', // بررسی اینکه این مقدار به درستی تنظیم شده باشد
                    })),

                    domains: data.domains.map((domain, index) => ({
                        ...domain,
                        expiry_date: domainExpiryDates[index],
                        reminder_date: domainReminderDates[index],
                    })),
                    host: {
                        ...data.host,
                        expiry_date: hostExpiryDate,
                        reminder_date: hostReminderDate,
                    }

                });

                showAlert('موفقیت', 'پروژه با موفقیت به‌روزرسانی شد.', 'success');
                navigate('/admin/projects/list');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : 'پاسخی از سرور دریافت نشد.';
                    showAlert('خطا!', `به‌روزرسانی پروژه با مشکل مواجه شد: ${errorMessage}`, 'error');
                } else {
                    showAlert('خطا!', 'به‌روزرسانی پروژه با مشکل مواجه شد: خطای ناشناخته.', 'error');
                }
            }
        }
    };

    return (
        <>
            <Breadcrumb pageName="ایجاد پروژه" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">ایجاد پروژه</h3>
                </div>
                <div className="p-6.5">
                    {/* Stepper */}
                    <div className="flex justify-center mb-5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`w-10 h-10 flex items-center justify-center rounded-full ${step === s ? 'bg-primary text-white' : 'bg-orange-400 text-white'} mx-2`}>
                                {s}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {step === 1 && (
                            <>
                                {/* اطلاعات پروژه */}
                                <div className="my-4.5 grid md:grid-cols-2 gap-6">
                                    <div className="w-full ">
                                        <label className="mb-2.5 block text-black dark:text-white">نام پروژه</label>
                                        <input
                                            type="text"
                                            {...register('name', { required: 'نام پروژه الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="نام پروژه را وارد کنید"
                                        />
                                        {errors.name && <p className="text-danger text-3 mt-2.5">{errors.name.message}</p>}
                                    </div>

                                    <div className="w-full ">
                                        <label className="mb-2.5 block text-black dark:text-white">وضعیت پروژه</label>
                                        <select
                                            {...register('status', { required: 'وضعیت پروژه الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.status ? 'border-red-500' : 'border-stroke'}`}
                                        >
                                            <option value="start">شروع</option>
                                            <option value="prepayment">پیش پرداخت</option>
                                            <option value="design">شروع طراحی</option>
                                            <option value="demo">دمو</option>
                                            <option value="learn">آموزش</option>
                                            <option value="completed">تکمیل شده</option>
                                        </select>
                                        {errors.status && <p className="text-danger text-3 mt-2.5">{errors.status.message}</p>}
                                    </div>
                                </div>
                                <div className="my-4.5 grid md:grid-cols-2 gap-6">
                                    {/* سایر فیلدهای فرم */}
                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">نام کارفرما</label>
                                        <input
                                            type="text"
                                            {...register('employer', { required: 'نام کارفرما الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.employer ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="نام کارفرما را وارد کنید"
                                        />
                                        {errors.employer && <p className="text-danger text-3 mt-2.5">{errors.employer.message}</p>}
                                    </div>

                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">شماره تماس</label>
                                        <input
                                            type="text"
                                            {...register('contact_number', { required: 'شماره تماس الزامی است.', pattern: { value: /^09\d{9}$/, message: 'شماره تماس باید با 09 شروع شده و 11 رقم باشد.' } })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.contact_number ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="شماره تماس مدیر پروژه را وارد کنید"
                                        />
                                        {errors.contact_number && <p className="text-danger text-3 mt-2.5">{errors.contact_number.message}</p>}
                                    </div>
                                </div>
                                <div className="my-4.5 grid md:grid-cols-2 gap-6">
                                    <div className="w-full ">
                                        <label className="mb-2.5 block text-black dark:text-white">ایمیل</label>
                                        <input
                                            type="email"
                                            {...register('username', { required: 'ایمیل الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.username ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="ایمیل را وارد کنید"
                                        />
                                        {errors.username && <p className="text-danger text-3 mt-2.5">{errors.username.message}</p>}
                                    </div>

                                    <div className="w-full ">
                                        <label className="mb-2.5 block text-black dark:text-white">پسورد</label>
                                        <input
                                            type="password"
                                            {...register('password', { required: 'پسورد الزامی است.', minLength: { value: 6, message: 'پسورد باید حداقل 6 کاراکتر باشد.' } })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.password ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="پسورد را وارد کنید"
                                        />
                                        {errors.password && <p className="text-danger text-3 mt-2.5">{errors.password.message}</p>}
                                    </div>
                                </div>



                                {/* تاریخ شروع و پایان پروژه */}
                                <div className="my-4.5 grid md:grid-cols-2 gap-6">
                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">تاریخ شروع پروژه</label>
                                        <DatePicker
                                            calendar={persian}
                                            placeholder='تاریخ شروع را وارد کنید'
                                            locale={persian_fa}
                                            calendarPosition="bottom-right"
                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.company_name ? 'border-red-500' : 'border-stroke'}`}
                                            containerStyle={{
                                                width: "100%"
                                            }}
                                            value={startDate}
                                            onChange={(date) => setStartDate(date?.format() || '')}
                                        />
                                        {errors.start_date && <p className="text-danger text-3 mt-2.5">{errors.start_date.message}</p>}
                                    </div>

                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">تاریخ پایان پروژه</label>
                                        <DatePicker
                                            calendar={persian}
                                            placeholder='تاریخ پایان را وارد کنید'
                                            locale={persian_fa}
                                            calendarPosition="bottom-right"
                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.company_name ? 'border-red-500' : 'border-stroke'}`}
                                            containerStyle={{
                                                width: "100%"
                                            }}
                                            value={endDate}
                                            onChange={(date) => setEndDate(date?.format() || '')}
                                        />
                                        {errors.end_date && <p className="text-danger text-3 mt-2.5">{errors.end_date.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="mb-2.5 block text-black dark:text-white">نوع مشتری</label>
                                    <select
                                        {...register('client_type', { required: 'نوع مشتری الزامی است.' })}
                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.client_type ? 'border-red-500' : 'border-stroke'}`}
                                    >
                                        <option value="individual">حقیقی</option>
                                        <option value="corporate">حقوقی</option>
                                    </select>
                                    {errors.client_type && <p className="text-danger text-3 mt-2.5">{errors.client_type.message}</p>}
                                </div>


                                {/* فیلد نام شرکت که در صورت انتخاب نوع مشتری حقوقی نمایش داده می‌شود */}
                                {clientType === 'corporate' && (
                                    <div className="w-full my-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">نام شرکت (در صورت حقوقی بودن)</label>
                                        <input
                                            type="text"
                                            {...register('company_name', { required: clientType === 'corporate' ? 'نام شرکت الزامی است.' : false })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.company_name ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="نام شرکت را وارد کنید"
                                        />
                                        {errors.company_name && <p className="text-danger text-3 mt-2.5">{errors.company_name.message}</p>}
                                    </div>
                                )}
                                <div className="my-4.5 grid md:grid-cols-2 gap-6">
                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">هزینه ی پروژه</label>
                                        <input
                                            type="text"
                                            {...register('price', { required: 'مبلغ پروژه الزامی است.', minLength: { value: 6, message: 'مبلغ را به درستی وارد کنید' } })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.price ? 'border-red-500' : 'border-stroke'}`}
                                            placeholder="مبلغ پروژه را وارد کنید"
                                        />
                                        {errors.price && <p className="text-danger text-3 mt-2.5">{errors.price.message}</p>}
                                    </div>

                                    <div className="w-full">
                                        <label className="mb-2.5 block text-black dark:text-white">نوع مشتری را انتخاب کنید</label>
                                        <select
                                            {...register('type', { required: 'نوع مشتری الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.client_type ? 'border-red-500' : 'border-stroke'}`}
                                        >
                                            <option selected value="bronze">برنزی</option>
                                            <option value="silver">نقره ای</option>
                                            <option value="gold">طلایی</option>
                                        </select>
                                        {errors.type && <p className="text-danger text-3 mt-2.5">{errors.type.message}</p>}
                                    </div>

                                </div>
                            </>
                        )}

                        { step === 2 && (
                            <>
                                {/* پرداخت‌ها */}
                                <section className="my-5">
                                    <h3 className="mb-5 text-lg font-semibold text-black dark:text-white">پرداخت‌ها</h3>
                                    <div className="grid grid-cols-2 gap-6 mb-4.5">
                                        {paymentFields.map((field, index) => (
                                            <div key={field.id}>
                                                <div className="mb-4.5">
                                                    <label className="mb-2.5 block text-black dark:text-white">علت پرداخت</label>
                                                    <input
                                                        type="text"
                                                        {...register(`payments.${index}.title`, { required: 'علت پرداخت الزامی است.' })}
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payments?.[index]?.title ? 'border-red-500' : 'border-stroke'}`}
                                                        placeholder="علت پرداخت را وارد کنید"
                                                    />
                                                    {errors.payments?.[index]?.title && <p className="text-danger text-3 mt-2.5">{errors.payments[index].title.message}</p>}
                                                </div>

                                                <div className="mb-4.5">
                                                    <label className="mb-2.5 block text-black dark:text-white">مبلغ پرداخت شده</label>
                                                    <input
                                                        type="number"
                                                        {...register(`payments.${index}.amount`, { required: 'مبلغ پرداخت شده الزامی است.', valueAsNumber: true })}
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payments?.[index]?.amount ? 'border-red-500' : 'border-stroke'}`}
                                                        placeholder="مبلغ پرداخت را وارد کنید"
                                                    />
                                                    {errors.payments?.[index]?.amount && <p className="text-danger text-3 mt-2.5">{errors.payments[index].amount.message}</p>}
                                                </div>

                                                <div className="mb-4.5">
                                                    <label className="mb-2.5 block text-black dark:text-white">وضعیت پرداخت</label>
                                                    <select
                                                        {...register(`payments.${index}.status`, {
                                                            required: "وضعیت پرداخت الزامی است.",
                                                        })}
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payments?.[index]?.status
                                                                ? "border-red-500"
                                                                : "border-stroke"
                                                            }`}
                                                    >
                                                        <option value="paid">پرداخت شده</option>
                                                        <option value="pending">در انتظار</option>
                                                        <option value="rejected">رد شده</option>
                                                    </select>
                                                    {errors.payments?.[index]?.status && (
                                                        <p className="text-danger text-3 mt-2.5">
                                                            {errors.payments[index].status.message}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* تاریخ برای پرداخت شده */}
                                                {watch(`payments.${index}.status`) === "paid" && (
                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            تاریخ پرداخت
                                                        </label>
                                                        <DatePicker
                                                            calendar={persian}
                                                            placeholder="تاریخ پرداخت را وارد کنید"
                                                            locale={persian_fa}
                                                            calendarPosition="bottom-right"
                                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payments?.[index]?.date
                                                                    ? "border-red-500"
                                                                    : "border-stroke"
                                                                }`}
                                                            containerStyle={{ width: "100%" }}
                                                            value={paymentDates[index]}
                                                            onChange={(date) => {
                                                                const newDates = [...paymentDates];
                                                                newDates[index] = date?.format() || "";
                                                                setPaymentDates(newDates);
                                                            }}
                                                        />
                                                        {errors.payments?.[index]?.date && (
                                                            <p className="text-danger text-3 mt-2.5">
                                                                {errors.payments[index].date.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* مهلت پرداخت برای در انتظار */}
                                                {watch(`payments.${index}.status`) === "pending" && (
                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            مهلت پرداخت
                                                        </label>
                                                        <DatePicker
                                                            calendar={persian}
                                                            placeholder="مهلت پرداخت را وارد کنید"
                                                            locale={persian_fa}
                                                            calendarPosition="bottom-right"
                                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payments?.[index]?.due_date
                                                                    ? "border-red-500"
                                                                    : "border-stroke"
                                                                }`}
                                                            containerStyle={{ width: "100%" }}
                                                            value={dueDates[index]}
                                                            onChange={(date) => {
                                                                const newDueDates = [...dueDates];
                                                                newDueDates[index] = date?.format() || "";
                                                                setDueDates(newDueDates);
                                                            }}
                                                        />
                                                        {errors.payments?.[index]?.due_date && (
                                                            <p className="text-danger text-3 mt-2.5">
                                                                {errors.payments[index].due_date.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* تاریخ رد شدن برای رد شده */}
                                                {watch(`payments.${index}.status`) === "rejected" && (
                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">
                                                            تاریخ رد شدن
                                                        </label>
                                                        <DatePicker
                                                            calendar={persian}
                                                            placeholder="تاریخ رد شدن را وارد کنید"
                                                            locale={persian_fa}
                                                            calendarPosition="bottom-right"
                                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payments?.[index]?.expiry_date
                                                                    ? "border-red-500"
                                                                    : "border-stroke"
                                                                }`}
                                                            containerStyle={{ width: "100%" }}
                                                            value={expiryDates[index]}
                                                            onChange={(date) => {
                                                                const newExpiryDates = [...expiryDates];
                                                                newExpiryDates[index] = date?.format() || "";
                                                                setExpiryDates(newExpiryDates);
                                                            }}
                                                        />
                                                        {errors.payments?.[index]?.expiry_date && (
                                                            <p className="text-danger text-3 mt-2.5">
                                                                {errors.payments[index].expiry_date.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* دکمه حذف پرداخت */}
                                                <button
                                                    type="button"
                                                    onClick={() => removePayment(index)}
                                                    className="flex items-center justify-center gap-2 rounded bg-red-500 py-2.5 px-4.5 font-medium text-white"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            appendPayment({ title: "", amount: 0, status: "pending", date: "", due_date: "", expiry_date: "" })
                                        }
                                        className="flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-4.5 font-medium text-white"
                                    >
                                        اضافه کردن پرداخت
                                    </button>
                                </section>
                            </>
                        )}


                        {step === 3 && (
                            <>
                                {/* مدیریت دامنه‌ها */}
                                <section className="my-5">
                                    <h3 className="mb-5 text-lg font-semibold text-black dark:text-white">مدیریت دامنه‌ها</h3>
                                    <div className="grid grid-cols-2 gap-6 mb-4.5">
                                        {domainFields.map((field, index) => {
                                            const purchaseType = watch(`domains.${index}.purchase_type`);
                                            return (
                                                <div key={field.id} className="mb-4.5">
                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">نام دامنه</label>
                                                        <input
                                                            type="text"
                                                            {...register(`domains.${index}.name`, { required: 'نام دامنه الزامی است.' })}
                                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.name ? 'border-red-500' : 'border-stroke'}`}
                                                            placeholder="نام دامنه را وارد کنید"
                                                        />
                                                        {errors.domains?.[index]?.name && <p className="text-danger text-3 mt-2.5">{errors.domains[index].name.message}</p>}
                                                    </div>

                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">نوع خرید دامنه</label>
                                                        <select
                                                            {...register(`domains.${index}.purchase_type`, { required: 'نوع خرید دامنه الزامی است.' })}
                                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.purchase_type ? 'border-red-500' : 'border-stroke'}`}
                                                        >
                                                            <option value="ours">خریداری شده توسط ما</option>
                                                            <option value="customer">خریداری شده توسط مشتری</option>
                                                        </select>
                                                        {errors.domains?.[index]?.purchase_type && <p className="text-danger text-3 mt-2.5">{errors.domains[index].purchase_type.message}</p>}
                                                    </div>

                                                    {purchaseType === 'customer' && (
                                                        <>
                                                            {/* فیلدهای اضافی برای دامنه‌های خریداری شده توسط مشتری */}
                                                            <div className="mb-4.5">
                                                                <label className="mb-2.5 block text-black dark:text-white">یوزرنیم</label>
                                                                <input
                                                                    type="text"
                                                                    {...register(`domains.${index}.purchase_site_username`, { required: 'یوزرنیم الزامی است.' })}
                                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.purchase_site_username ? 'border-red-500' : 'border-stroke'}`}
                                                                    placeholder="یوزرنیم را وارد کنید"
                                                                />
                                                                {errors.domains?.[index]?.purchase_site_username && <p className="text-danger text-3 mt-2.5">{errors.domains[index].purchase_site_username.message}</p>}
                                                            </div>

                                                            <div className="mb-4.5">
                                                                <label className="mb-2.5 block text-black dark:text-white">پسورد</label>
                                                                <input
                                                                    type="password"
                                                                    {...register(`domains.${index}.purchase_site_password`, { required: 'پسورد الزامی است.' })}
                                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.purchase_site_password ? 'border-red-500' : 'border-stroke'}`}
                                                                    placeholder="پسورد را وارد کنید"
                                                                />
                                                                {errors.domains?.[index]?.purchase_site_password && <p className="text-danger text-3 mt-2.5">{errors.domains[index].purchase_site_password.message}</p>}
                                                            </div>

                                                            <div className="mb-4.5">
                                                                <label className="mb-2.5 block text-black dark:text-white">آدرس سایت خریداری شده</label>
                                                                <input
                                                                    type="text"
                                                                    {...register(`domains.${index}.purchase_site_url`, { required: 'آدرس سایت الزامی است.' })}
                                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.purchase_site_url ? 'border-red-500' : 'border-stroke'}`}
                                                                    placeholder="آدرس سایت خریداری شده را وارد کنید"
                                                                />
                                                                {errors.domains?.[index]?.purchase_site_url && <p className="text-danger text-3 mt-2.5">{errors.domains[index].purchase_site_url.message}</p>}
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">تاریخ انقضا</label>
                                                        <DatePicker
                                                            calendar={persian}
                                                            placeholder='تاریخ انقضا را وارد کنید'
                                                            locale={persian_fa}
                                                            calendarPosition="bottom-right"
                                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.expiry_date ? 'border-red-500' : 'border-stroke'}`}
                                                            containerStyle={{ width: "100%" }}
                                                            value={domainExpiryDates[index]}
                                                            onChange={(date) => {
                                                                const newExpiryDates = [...domainExpiryDates];
                                                                newExpiryDates[index] = date?.format() || '';
                                                                setDomainExpiryDates(newExpiryDates);
                                                            }}
                                                        />
                                                        {errors.domains?.[index]?.expiry_date && <p className="text-danger text-3 mt-2.5">{errors.domains[index].expiry_date.message}</p>}
                                                    </div>

                                                    <div className="mb-4.5">
                                                        <label className="mb-2.5 block text-black dark:text-white">تاریخ یادآوری</label>
                                                        <DatePicker
                                                            calendar={persian}
                                                            placeholder='تاریخ یادآوری را وارد کنید'
                                                            locale={persian_fa}
                                                            calendarPosition="bottom-right"
                                                            inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.domains?.[index]?.reminder_date ? 'border-red-500' : 'border-stroke'}`}
                                                            containerStyle={{ width: "100%" }}
                                                            value={domainReminderDates[index]}
                                                            onChange={(date) => {
                                                                const newReminderDates = [...domainReminderDates];
                                                                newReminderDates[index] = date?.format() || '';
                                                                setDomainReminderDates(newReminderDates);
                                                            }}
                                                        />
                                                        {errors.domains?.[index]?.reminder_date && <p className="text-danger text-3 mt-2.5">{errors.domains[index].reminder_date.message}</p>}
                                                    </div>
                                                    <input type="hidden" {...register(`domains.${index}.status`)} />
                                                    <button type="button" onClick={() => removeDomain(index)} className="flex items-center justify-center gap-2 rounded bg-red-500 py-2.5 px-4.5 font-medium text-white">حذف دامنه</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => appendDomain({ name: '', expiry_date: '', reminder_date: '', purchase_type: 'ours' })}
                                        className="flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-4.5 font-medium text-white"
                                    >
                                        اضافه کردن دامنه جدید
                                    </button>
                                </section>
                            </>
                        )}


                        {step === 4 && (
                            <>
                                {/* مدیریت هاست */}
                                <section className="my-5">
                                    <h3 className="mb-5 text-lg font-semibold text-black dark:text-white">مدیریت هاست</h3>

                                    {/* انتخاب نوع خرید هاست */}
                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">نوع خرید هاست</label>
                                        <select
                                            {...register('host.purchase_type', { required: 'نوع خرید هاست الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.purchase_type ? 'border-red-500' : 'border-stroke'}`}
                                        >
                                            <option value="ours">خریداری شده توسط ما</option>
                                            <option value="customer">خریداری شده توسط مشتری</option>
                                        </select>
                                        {errors.host?.purchase_type && <p className="text-danger text-3 mt-2.5">{errors.host.purchase_type.message}</p>}
                                    </div>

                                    {/* فیلدهای هاست خریداری شده توسط ما */}
                                    {hostType === 'ours' && (
                                        <>
                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">نام کاربری</label>
                                                <input
                                                    type="text"
                                                    {...register('host.username', { required: 'نام کاربری الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.username ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="نام کاربری هاست را وارد کنید"
                                                />
                                                {errors.host?.username && <p className="text-danger text-3 mt-2.5">{errors.host.username.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">پسورد</label>
                                                <input
                                                    type="password"
                                                    {...register('host.password', { required: 'پسورد هاست الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.password ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="پسورد هاست را وارد کنید"
                                                />
                                                {errors.host?.password && <p className="text-danger text-3 mt-2.5">{errors.host.password.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">لینک هاست</label>
                                                <input
                                                    type="text"
                                                    {...register('host.link', { required: 'لینک هاست الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.link ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="لینک هاست را وارد کنید"
                                                />
                                                {errors.host?.link && <p className="text-danger text-3 mt-2.5">{errors.host.link.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">تاریخ انقضا</label>
                                                <DatePicker
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    calendarPosition="bottom-right"
                                                    inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.expiry_date ? 'border-red-500' : 'border-stroke'}`}
                                                    containerStyle={{ width: "100%" }}
                                                    onChange={(date) => setHostExpiryDate(date?.format() || '')}
                                                    value={hostExpiryDate}
                                                    placeholder="تاریخ انقضا را وارد کنید"
                                                />
                                                {errors.host?.expiry_date && <p className="text-danger text-3 mt-2.5">{errors.host.expiry_date.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">تاریخ یادآوری</label>
                                                <DatePicker
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    calendarPosition="bottom-right"
                                                    inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.reminder_date ? 'border-red-500' : 'border-stroke'}`}
                                                    containerStyle={{ width: "100%" }}
                                                    value={hostReminderDate}
                                                    onChange={(date) => setHostReminderDate(date?.format() || '')}
                                                    placeholder="تاریخ یادآوری را وارد کنید"
                                                />
                                                {errors.host?.reminder_date && <p className="text-danger text-3 mt-2.5">{errors.host.reminder_date.message}</p>}
                                            </div>
                                        </>
                                    )}

                                    {/* فیلدهای هاست خریداری شده توسط مشتری */}
                                    {hostType === 'customer' && (
                                        <>
                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">نام کاربری</label>
                                                <input
                                                    type="text"
                                                    {...register('host.username', { required: 'نام کاربری الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.username ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="نام کاربری هاست را وارد کنید"
                                                />
                                                {errors.host?.username && <p className="text-danger text-3 mt-2.5">{errors.host.username.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">پسورد</label>
                                                <input
                                                    type="password"
                                                    {...register('host.password', { required: 'پسورد هاست الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.password ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="پسورد هاست را وارد کنید"
                                                />
                                                {errors.host?.password && <p className="text-danger text-3 mt-2.5">{errors.host.password.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">لینک هاست</label>
                                                <input
                                                    type="text"
                                                    {...register('host.link', { required: 'لینک هاست الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.link ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="لینک هاست را وارد کنید"
                                                />
                                                {errors.host?.link && <p className="text-danger text-3 mt-2.5">{errors.host.link.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">تاریخ انقضا</label>
                                                <DatePicker
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    calendarPosition="bottom-right"
                                                    inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.expiry_date ? 'border-red-500' : 'border-stroke'}`}
                                                    containerStyle={{ width: "100%" }}
                                                    onChange={(date) => setValue('host.expiry_date', date?.toString())}
                                                    placeholder="تاریخ انقضا را وارد کنید"
                                                />
                                                {errors.host?.expiry_date && <p className="text-danger text-3 mt-2.5">{errors.host.expiry_date.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">تاریخ یادآوری</label>
                                                <DatePicker
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    calendarPosition="bottom-right"
                                                    inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.reminder_date ? 'border-red-500' : 'border-stroke'}`}
                                                    containerStyle={{ width: "100%" }}
                                                    onChange={(date) => setValue('host.reminder_date', date?.toString())}
                                                    placeholder="تاریخ یادآوری را وارد کنید"
                                                />
                                                {errors.host?.reminder_date && <p className="text-danger text-3 mt-2.5">{errors.host.reminder_date.message}</p>}
                                            </div>


                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">فضای هاست</label>
                                                <input
                                                    type="text"
                                                    {...register('host.space', { required: 'فضای هاست الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.space ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="فضای هاست را وارد کنید"
                                                />
                                                {errors.host?.space && <p className="text-danger text-3 mt-2.5">{errors.host.space.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">قیمت هاست</label>
                                                <input
                                                    type="number"
                                                    {...register('host.price', { required: 'قیمت هاست الزامی است.', valueAsNumber: true })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.price ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="قیمت هاست را وارد کنید"
                                                />
                                                {errors.host?.price && <p className="text-danger text-3 mt-2.5">{errors.host.price.message}</p>}
                                            </div>

                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">نام شرکت میزبان</label>
                                                <input
                                                    type="text"
                                                    {...register('host.company_name', { required: 'نام شرکت میزبان الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.host?.company_name ? 'border-red-500' : 'border-stroke'}`}
                                                    placeholder="نام شرکت میزبان را وارد کنید"
                                                />
                                                {errors.host?.company_name && <p className="text-danger text-3 mt-2.5">{errors.host.company_name.message}</p>}
                                            </div>
                                        </>
                                    )}
                                </section>

                            </>
                        )}

                        {step === 5 && (
                            <>
                                {/* مدیریت پشتیبانی */}
                                <section className="my-5">
                                    <h3 className="mb-5 text-lg font-semibold text-black dark:text-white">مدیریت پشتیبانی</h3>

                                    <div className="mb-4.5">
                                        <label className="mb-2.5 block text-black dark:text-white">پشتیبانی دارد؟</label>
                                        <select
                                            {...register('support.status', { required: 'وضعیت پشتیبانی الزامی است.' })}
                                            className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.support?.status ? 'border-red-500' : 'border-stroke'}`}
                                        >
                                            <option value="no">خیر</option>
                                            <option value="yes">بله</option>
                                        </select>
                                        {errors.support?.status && <p className="text-danger text-3 mt-2.5">{errors.support.status.message}</p>}
                                    </div>

                                    {watch('support.status') === 'yes' && (
                                        <>
                                            {/* انتخاب مدت زمان پشتیبانی */}
                                            <div className="mb-4.5">
                                                <label className="mb-2.5 block text-black dark:text-white">مدت زمان پشتیبانی</label>
                                                <select
                                                    {...register('support.duration', { required: 'مدت زمان پشتیبانی الزامی است.' })}
                                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.support?.duration ? 'border-red-500' : 'border-stroke'}`}
                                                >
                                                    <option value="">مدت زمان را انتخاب کنید</option>
                                                    <option value="6months">۶ ماه</option>
                                                    <option value="12months">۱۲ ماه</option>
                                                </select>
                                                {errors.support?.duration && <p className="text-danger text-3 mt-2.5">{errors.support.duration.message}</p>}
                                            </div>

                                            {/* فیلد هزینه پشتیبانی بر اساس مدت زمان */}
                                            {watch('support.duration') === '6months' && (
                                                <div className="mb-4.5">
                                                    <label className="mb-2.5 block text-black dark:text-white">هزینه پشتیبانی ۶ ماهه</label>
                                                    <input
                                                        type="number"
                                                        {...register('support.price', { required: 'هزینه پشتیبانی ۶ ماهه الزامی است.', valueAsNumber: true })}
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.support?.price ? 'border-red-500' : 'border-stroke'}`}
                                                        placeholder="هزینه پشتیبانی ۶ ماهه را وارد کنید"
                                                    />
                                                    {errors.support?.price && <p className="text-danger text-3 mt-2.5">{errors.support.price.message}</p>}
                                                </div>
                                            )}

                                            {watch('support.duration') === '12months' && (
                                                <div className="mb-4.5">
                                                    <label className="mb-2.5 block text-black dark:text-white">هزینه پشتیبانی ۱۲ ماهه</label>
                                                    <input
                                                        type="number"
                                                        {...register('support.price', { required: 'هزینه پشتیبانی ۱۲ ماهه الزامی است.', valueAsNumber: true })}
                                                        className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.support?.price ? 'border-red-500' : 'border-stroke'}`}
                                                        placeholder="هزینه پشتیبانی ۱۲ ماهه را وارد کنید"
                                                    />
                                                    {errors.support?.price && <p className="text-danger text-3 mt-2.5">{errors.support.price.message}</p>}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </section>



                                {/* فیلد برای وارد کردن جزئیات */}
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">جزئیات پشتیبانی</label>
                                    <textarea
                                        {...register('details')}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        placeholder="جزئیات بیشتر در مورد پشتیبانی را وارد کنید"
                                        rows={4}
                                        value={details}
                                    ></textarea>
                                </div>
                            </>
                        )}

                        {/* دکمه‌های رفتن به مرحله قبل و بعد */}
                        <div className='flex gap-4 mt-4'>
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex w-full justify-center rounded bg-orange-500 p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    بازگشت به مرحله قبل
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                            >
                                {step < 5 ? 'مرحله بعد' : 'ارسال فرم'}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </>
    );
};

export default ProjectEdit;
