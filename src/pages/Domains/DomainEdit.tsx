import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import api from '../../api/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { StylesConfig, SingleValue } from 'react-select';

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

interface DomainFormData {
  name: string;
  expiry_date: string;
  reminder_date: string;
  purchase_type: 'ours' | 'customer';
  reminder: '0' | '1';
  price: number;
  associated_with: 'project' | 'user' | '';
  project_id: number | null;
  user_id: number | null;
  purchase_site_username?: string;
  purchase_site_password?: string;
  purchase_site_url?: string;
}

interface OptionType {
  value: string | number;
  label: string;
}

const DomainEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // دریافت آیدی دامنه از پارامترهای URL
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DomainFormData>({
    defaultValues: {
      name: '',
      expiry_date: '',
      reminder_date: '',
      purchase_type: 'ours',
      reminder: '0',
      associated_with: '',
      project_id: null,
      user_id: null,
    }
  });
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState<string | null>(null);
  const [users, setUsers] = useState<OptionType[]>([]);
  const [projects, setProjects] = useState<OptionType[]>([]);

  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
  };

  const onSubmit = async (data: DomainFormData) => {
    try {
      await api.put(`/api/domains/${id}`, data);
      showAlert('موفقیت', 'دامنه با موفقیت ویرایش شد.', 'success');
      navigate('/admin/domains/list');
    } catch (error) {
      console.error('Error updating domain:', error);
      showAlert('خطا!', 'ویرایش دامنه با مشکل مواجه شد.', 'error');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get('/api/all-users'),
          api.get('/api/all-projects'),
        ]);

        const usersData = usersResponse.data.map((user: any) => ({
          value: user.id,
          label: user.name,
        }));

        const projectsData = projectsResponse.data.map((project: any) => ({
          value: project.id,
          label: project.name,
        }));

        setUsers(usersData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('خطا!', 'دریافت داده‌ها با مشکل مواجه شد.', 'error');
      }
    };

    const fetchDomain = async () => {
      try {
        const response = await api.get(`/api/domains/${id}`);
        const domainData = response.data.data;

        setValue('name', domainData.name);
        setValue('expiry_date', domainData.expiry_date);
        setValue('reminder_date', domainData.reminder_date);
        setValue('purchase_type', domainData.purchase_type);
        setValue('reminder', domainData.reminder ? '1' : '0');
        setValue('price', domainData.price);
        setValue('associated_with', domainData.project_id ? 'project' : domainData.user_id ? 'user' : '');
        setValue('project_id', domainData.project_id);
        setValue('user_id', domainData.user_id);
        setValue('purchase_site_username', domainData.purchase_site_username);
        setValue('purchase_site_password', domainData.purchase_site_password);
        setValue('purchase_site_url', domainData.purchase_site_url);
        setExpiryDate(domainData.expiry_date);
        setReminderDate(domainData.reminder_date);
      } catch (error) {
        console.error('Error fetching domain data:', error);
        showAlert('خطا!', 'دریافت اطلاعات دامنه با مشکل مواجه شد.', 'error');
      }
    };

    fetchAllData();
    fetchDomain();
  }, [id, setValue]);

  const handleUserChange = (selectedOption: SingleValue<OptionType>) => {
    setValue('user_id', Number(selectedOption?.value) || null);

  };

  const handleProjectChange = (selectedOption: SingleValue<OptionType>) => {
    setValue('project_id', Number(selectedOption?.value) || null);

  };

  const associatedWith = watch('associated_with');
  const purchaseType = watch('purchase_type');
  useEffect(() => {
    if (associatedWith === 'project') {
      setValue('user_id', null);
    } else if (associatedWith === 'user') {
      setValue('project_id', null);
    }
  }, [associatedWith, setValue]);

  return (
    <>
      <Breadcrumb pageName="ایجاد دامنه جدید" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">ایجاد دامنه جدید</h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Domain Information */}
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نام دامنه</label>
                <input
                  type="text"
                  {...register('name', { required: 'نام دامنه الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="نام دامنه"
                />
                {errors.name && <p className="text-danger text-3 mt-2.5">{errors.name.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">هزینه دامنه</label>
                <input
                  type="text"
                  {...register('price', { required: 'هزینه دامنه الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.price ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="هزینه دامنه"
                />
                {errors.price && <p className="text-danger text-3 mt-2.5">{errors.price.message}</p>}
              </div>
            </div>
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              {/* Expiry Date */}
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">تاریخ انقضا</label>
                <DatePicker
                  calendar={persian}
                  placeholder="تاریخ انقضا"
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.expiry_date ? 'border-red-500' : 'border-stroke'}`}
                  containerStyle={{ width: '100%' }}
                  value={expiryDate} // مقداردهی از state
                  onChange={(date) => {
                    const formattedDate = date?.format() || '';
                    setExpiryDate(formattedDate); // به‌روزرسانی state
                    setValue('expiry_date', formattedDate); // به‌روزرسانی فرم
                  }}
                />
                {errors.expiry_date && <p className="text-danger text-3 mt-2.5">{errors.expiry_date.message}</p>}
              </div>

              {/* Reminder Date */}
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">تاریخ یادآوری</label>
                <DatePicker
                  calendar={persian}
                  placeholder="تاریخ یادآوری"
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder_date ? 'border-red-500' : 'border-stroke'}`}
                  containerStyle={{ width: '100%' }}
                  value={reminderDate} // مقداردهی از state
                  onChange={(date) => {
                    const formattedDate = date?.format() || '';
                    setReminderDate(formattedDate); // به‌روزرسانی state
                    setValue('reminder_date', formattedDate); // به‌روزرسانی فرم
                  }}
                />
                {errors.reminder_date && <p className="text-danger text-3 mt-2.5">{errors.reminder_date.message}</p>}
              </div>
            </div>
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              {/* Purchase Type */}
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نوع خرید</label>
                <select
                  {...register('purchase_type', { required: 'نوع خرید الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.purchase_type ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="ours">خریداری شده توسط ما</option>
                  <option value="customer">خریداری شده توسط مشتری</option>
                </select>
                {errors.purchase_type && <p className="text-danger text-3 mt-2.5">{errors.purchase_type.message}</p>}
              </div>

              {/* Reminder Status */}
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">یادآور</label>
                <select
                  {...register('reminder', { required: 'وضعیت یادآور الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="0">فعال</option>
                  <option value="1">غیرفعال</option>
                </select>
                {errors.reminder && <p className="text-danger text-3 mt-2.5">{errors.reminder.message}</p>}
              </div>
            </div>

            {/* Associate With: Project or User */}
            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">اضافه کردن به:</label>
              <select
                {...register('associated_with', { required: 'این فیلد الزامی است.' })}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white`}
              >
                <option value="">انتخاب کنید</option>
                <option value="project">پروژه</option>
                <option value="user">کاربر</option>
              </select>
            </div>

            {/* Select Project or User */}
            {associatedWith === 'project' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">انتخاب پروژه</label>
                <Select
                  styles={customStyles}
                  options={projects}
                  onChange={handleProjectChange}
                  placeholder="پروژه را انتخاب کنید"
                  isClearable
                  value={projects.find(option => option.value === watch('project_id'))}
                />
              </div>
            )}

            {associatedWith === 'user' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">انتخاب کاربر</label>
                <Select
                  styles={customStyles}
                  options={users}
                  onChange={handleUserChange}
                  placeholder="کاربر را انتخاب کنید"
                  isClearable
                  value={users.find(option => option.value === watch('user_id'))}
                />
              </div>
            )}

             {/* Show extra fields when "customer" is selected */}
             {purchaseType === 'customer' && (
              <>
                <div className="my-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">یوزرنیم</label>
                  <input
                    type="text"
                    {...register('purchase_site_username', { required: 'یوزرنیم الزامی است.' })}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.purchase_site_username ? 'border-red-500' : 'border-stroke'}`}
                    placeholder="یوزرنیم"
                  />
                  {errors.purchase_site_username && <p className="text-danger text-3 mt-2.5">{errors.purchase_site_username.message}</p>}
                </div>

                <div className="my-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">پسورد</label>
                  <input
                    type="password"
                    {...register('purchase_site_password', { required: 'پسورد الزامی است.' })}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.purchase_site_password ? 'border-red-500' : 'border-stroke'}`}
                    placeholder="پسورد"
                  />
                  {errors.purchase_site_password && <p className="text-danger text-3 mt-2.5">{errors.purchase_site_password.message}</p>}
                </div>

                <div className="my-4.5">
                  <label className="block mb-2.5 text-black dark:text-white">آدرس سایت خریداری شده</label>
                  <input
                    type="text"
                    {...register('purchase_site_url', { required: 'آدرس سایت الزامی است.' })}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.purchase_site_url ? 'border-red-500' : 'border-stroke'}`}
                    placeholder="آدرس سایت خریداری شده"
                  />
                  {errors.purchase_site_url && <p className="text-danger text-3 mt-2.5">{errors.purchase_site_url.message}</p>}
                </div>
              </>
            )}

            <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
              اپدیت دامنه
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DomainEdit;
