import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { StylesConfig } from 'react-select';

const MySwal = withReactContent(Swal);

const customStyles: StylesConfig<any, false> = {
    control: (provided) => ({
        ...provided,
        borderColor: 'rgb(61 77 95)',
        borderWidth: '1.5px',
        borderRadius: '5px',
        padding: '0.5rem',
        backgroundColor: 'transparent',
        color: '#ffffff',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#2563eb' : 'white',
        color: state.isFocused ? 'white' : '#0062ff',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#ffffff',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffffff',
    }),
};

interface InvoiceFormData {
    amount: number;
    title: string;
    date: string;
    authority: string;
    status: 'paid' | 'pending' | 'rejected';
    payment_type: 'cash' | 'check' | 'installment';
    due_date: string;
    expiry_date: string;
    item_type: 'project' | 'host' | 'domain' | 'support';
    item_id: number | null;
}

interface OptionType {
    value: number;
    label: string;
}

const InvoiceEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // دریافت آیدی فاکتور از پارامترهای URL
    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<InvoiceFormData>({
        defaultValues: {
            amount: 0,
            title: '',
            date: '',
            authority: '',
            status: 'pending',
            payment_type: 'cash',
            due_date: '',
            expiry_date: '',
            item_type: 'project',
            item_id: null,
        }
    });

    const [projects, setProjects] = useState<OptionType[]>([]);
    const [hosts, setHosts] = useState<OptionType[]>([]);
    const [domains, setDomains] = useState<OptionType[]>([]);
    const [supports, setSupports] = useState<OptionType[]>([]);
    const navigate = useNavigate();

    const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
        return MySwal.fire({ title, text, icon, confirmButtonText });
    };

    const onSubmit = async (data: InvoiceFormData) => {
        try {
            await api.put(`/api/payments/${id}`, data);
            showAlert('موفقیت', 'فاکتور با موفقیت ویرایش شد.', 'success');
            navigate('/invoices/list');
        } catch (error) {
            console.error('Error updating invoice:', error);
            showAlert('خطا!', 'ویرایش فاکتور با مشکل مواجه شد.', 'error');
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [projectsResponse, hostsResponse, domainsResponse, supportsResponse] = await Promise.all([
                    api.get('/api/all-projects'),
                    api.get('/api/hosts'),
                    api.get('/api/domains'),
                    api.get('/api/supports'),
                ]);

                setProjects(projectsResponse.data.map((project: any) => ({ value: project.id, label: project.name })));
                setHosts(hostsResponse.data.data.map((host: any) => ({ value: host.id, label: host.username })));
                setDomains(domainsResponse.data.data.map((domain: any) => ({ value: domain.id, label: domain.name })));
                setSupports(supportsResponse.data.data.map((support: any) => ({ value: support.id, label: support.name })));
            } catch (error) {
                console.error('Error fetching data:', error);
                showAlert('خطا!', 'دریافت داده‌ها با مشکل مواجه شد.', 'error');
            }
        };

        const fetchInvoice = async () => {
            try {
                const response = await api.get(`/api/payments/${id}`);
                const invoiceData = response.data.data;
                setValue('amount', invoiceData.amount);
                setValue('title', invoiceData.title);
                setValue('date', invoiceData.date);
                setValue('authority', invoiceData.authority || '');
                setValue('status', invoiceData.status);
                setValue('payment_type', invoiceData.payment_type);
                setValue('due_date', invoiceData.due_date);
                setValue('expiry_date', invoiceData.expiry_date || '');
                setValue('item_type', invoiceData.project_id ? 'project' : invoiceData.host_id ? 'host' : invoiceData.domain_id ? 'domain' : 'support');
                setValue('item_id', invoiceData.project_id || invoiceData.host_id || invoiceData.domain_id || invoiceData.support_id);
            } catch (error) {
                console.error('Error fetching invoice data:', error);
                showAlert('خطا!', 'دریافت اطلاعات فاکتور با مشکل مواجه شد.', 'error');
            }
        };

        fetchAllData();
        fetchInvoice();
    }, [id, setValue]);

    const itemType = watch('item_type');

    const getItemOptions = () => {
        switch (itemType) {
            case 'project':
                return projects;
            case 'host':
                return hosts;
            case 'domain':
                return domains;
            case 'support':
                return supports;
            default:
                return [];
        }
    };

    return (
        <>
            <Breadcrumb pageName="ویرایش فاکتور" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">ویرایش فاکتور</h3>
                </div>
                <div className="p-6.5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* عنوان و مبلغ */}
                        <div className="my-4.5 grid md:grid-cols-2 gap-6">
                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">عنوان</label>
                                <input
                                    type="text"
                                    {...register('title', { required: 'عنوان الزامی است.' })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.title ? 'border-red-500' : 'border-stroke'}`}
                                    placeholder="عنوان فاکتور"
                                />
                                {errors.title && <p className="text-danger text-3 mt-2.5">{errors.title.message}</p>}
                            </div>

                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">مبلغ</label>
                                <input
                                    type="number"
                                    {...register('amount', { required: 'مبلغ الزامی است.', min: 1 })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.amount ? 'border-red-500' : 'border-stroke'}`}
                                    placeholder="مبلغ فاکتور"
                                />
                                {errors.amount && <p className="text-danger text-3 mt-2.5">{errors.amount.message}</p>}
                            </div>
                        </div>

                        {/* تاریخ‌ها */}
                        <div className="my-4.5 grid md:grid-cols-2 gap-6">
                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">تاریخ فاکتور</label>
                                <DatePicker
                                    calendar={persian}
                                    placeholder="تاریخ فاکتور"
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.date ? 'border-red-500' : 'border-stroke'}`}
                                    containerStyle={{ width: '100%' }}
                                    onChange={(date) => setValue('date', date?.format() || '')}
                                />
                                {errors.date && <p className="text-danger text-3 mt-2.5">{errors.date.message}</p>}
                            </div>

                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">تاریخ سررسید</label>
                                <DatePicker
                                    calendar={persian}
                                    placeholder="تاریخ سررسید"
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.due_date ? 'border-red-500' : 'border-stroke'}`}
                                    containerStyle={{ width: '100%' }}
                                    onChange={(date) => setValue('due_date', date?.format() || '')}
                                />
                                {errors.due_date && <p className="text-danger text-3 mt-2.5">{errors.due_date.message}</p>}
                            </div>
                        </div>

                        {/* انتخاب وضعیت و نوع پرداخت */}
                        <div className="my-4.5 grid md:grid-cols-2 gap-6">
                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">وضعیت پرداخت</label>
                                <select
                                    {...register('status', { required: 'وضعیت پرداخت الزامی است.' })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.status ? 'border-red-500' : 'border-stroke'}`}
                                >
                                    <option value="paid">پرداخت شده</option>
                                    <option value="pending">در انتظار</option>
                                    <option value="rejected">رد شده</option>
                                </select>
                                {errors.status && <p className="text-danger text-3 mt-2.5">{errors.status.message}</p>}
                            </div>

                            <div className="my-4.5">
                                <label className="block mb-2.5 text-black dark:text-white">نوع پرداخت</label>
                                <select
                                    {...register('payment_type', { required: 'نوع پرداخت الزامی است.' })}
                                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.payment_type ? 'border-red-500' : 'border-stroke'}`}
                                >
                                    <option value="cash">نقدی</option>
                                    <option value="check">چک</option>
                                    <option value="installment">قسطی</option>
                                </select>
                                {errors.payment_type && <p className="text-danger text-3 mt-2.5">{errors.payment_type.message}</p>}
                            </div>
                        </div>

                        {/* انتخاب نوع آیتم و آیتم مرتبط */}
                        <div className="my-4.5">
                            <label className="block mb-2.5 text-black dark:text-white">انتخاب نوع آیتم</label>
                            <select
                                {...register('item_type', { required: 'نوع آیتم الزامی است.' })}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            >
                                <option value="project">پروژه</option>
                                <option value="host">هاست</option>
                                <option value="domain">دامنه</option>
                                <option value="support">پشتیبانی</option>
                            </select>
                        </div>

                        {/* انتخاب آیتم */}
                        <div className="my-4.5">
                            <label className="block mb-2.5 text-black dark:text-white">انتخاب آیتم</label>
                            <Controller
                                name="item_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        styles={customStyles}
                                        options={getItemOptions()}
                                        placeholder="آیتم را انتخاب کنید"
                                        isClearable
                                    />
                                )}
                            />
                        </div>

                        <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
                            ویرایش فاکتور
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default InvoiceEdit;
