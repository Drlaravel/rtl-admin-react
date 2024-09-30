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

interface SupportFormData {
  name: string;
  status: 'yes' | 'no';
  duration: '6months' | '12months';
  price: number;
  expiry_date: string;
  reminder: boolean;
  associated_with: 'project' | 'user' | '';
  project_id: number | null;
  user_id: number | null;
  shouldCreateInvoice: boolean;
}

interface OptionType {
  value: string | number;
  label: string;
}

const SupportEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors }, control } = useForm<SupportFormData>({
    defaultValues: {
      name: '',
      status: 'yes',
      duration: '6months',
      price: 0,
      expiry_date: '',
      reminder: false,
      associated_with: '',
      project_id: null,
      user_id: null,
      shouldCreateInvoice: false,
    }
  });

  const [users, setUsers] = useState<OptionType[]>([]);
  const [projects, setProjects] = useState<OptionType[]>([]);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState<string | null>(null);
  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
  };

  const onSubmit = async (data: SupportFormData) => {
    try {
      await api.put(`/api/supports/${id}`, data);
      showAlert('موفقیت', 'پشتیبانی با موفقیت ویرایش شد.', 'success');
      navigate('/admin/supports/list');
    } catch (error) {
      console.error('Error updating support:', error);
      showAlert('خطا!', 'ویرایش پشتیبانی با مشکل مواجه شد.', 'error');
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

    const fetchSupport = async () => {
      try {
        const response = await api.get(`/api/supports/${id}`);
        const supportData = response.data.data;

        setValue('name', supportData.name);
        setValue('status', supportData.status);
        setValue('duration', supportData.duration);
        setValue('price', supportData.price);
        setValue('expiry_date', supportData.expiry_date);
        setValue('reminder', supportData.reminder);
        setValue('associated_with', supportData.project_id ? 'project' : supportData.user_id ? 'user' : '');
        setValue('project_id', supportData.project_id);
        setValue('user_id', supportData.user_id);
        setValue('shouldCreateInvoice', supportData.shouldCreateInvoice);
        setExpiryDate(supportData.expiry_date);
        setReminderDate(supportData.reminder_date);
      } catch (error) {
        console.error('Error fetching support data:', error);
        showAlert('خطا!', 'دریافت اطلاعات پشتیبانی با مشکل مواجه شد.', 'error');
      }
    };

    fetchAllData();
    fetchSupport();
  }, [id, setValue]);

  const handleUserChange = (selectedOption: SingleValue<OptionType>) => {
    setValue('user_id', selectedOption ? selectedOption.value : null);
  };

  const handleProjectChange = (selectedOption: SingleValue<OptionType>) => {
    setValue('project_id', selectedOption ? selectedOption.value : null);
  };

  const associatedWith = watch('associated_with');

  useEffect(() => {
    if (associatedWith === 'project') {
      setValue('user_id', null);
    } else if (associatedWith === 'user') {
      setValue('project_id', null);
    }
  }, [associatedWith, setValue]);

  return (
    <>
      <Breadcrumb pageName="ایجاد پشتیبانی جدید" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">ایجاد پشتیبانی جدید</h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">نام پشتیبانی</label>
              <input
                type="text"
                {...register('name', { required: 'نام پشتیبانی الزامی است.' })}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-stroke'}`}
                placeholder="نام پشتیبانی"
              />
              {errors.name && <p className="text-danger text-3 mt-2.5">{errors.name.message}</p>}
            </div>



            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">مدت زمان</label>
                <select
                  {...register('duration', { required: 'مدت زمان الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.duration ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="6months">6 ماه</option>
                  <option value="12months">12 ماه</option>
                </select>
              </div>

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
            </div>

            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">قیمت</label>
                <input
                  type="text"
                  {...register('price', { required: 'قیمت الزامی است.', valueAsNumber: true })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.price ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="قیمت"
                />
                {errors.price && <p className="text-danger text-3 mt-2.5">{errors.price.message}</p>}
              </div>
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">وضعیت</label>
                <select
                  {...register('status', { required: 'وضعیت الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.status ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="yes">فعال</option>
                  <option value="no">غیرفعال</option>
                </select>
              </div>

            </div>

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
              {errors.associated_with && <p className="text-danger text-3 mt-2.5">{errors.associated_with.message}</p>}
            </div>

            {associatedWith === 'project' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">انتخاب پروژه</label>
                <Controller
                  name="project_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      styles={customStyles}
                      options={projects}
                      placeholder="پروژه را انتخاب کنید"
                      isClearable
                    />
                  )}
                />
              </div>
            )}

            {associatedWith === 'user' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">انتخاب کاربر</label>
                <Controller
                  name="user_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      styles={customStyles}
                      options={users}
                      placeholder="کاربر را انتخاب کنید"
                      isClearable
                    />
                  )}
                />
              </div>
            )}

            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">ایجاد فاکتور</label>
              <input
                type="checkbox"
                {...register('shouldCreateInvoice')}
                className="w-4 h-4 text-primary border-stroke dark:border-form-strokedark dark:bg-form-input rounded"
              />
            </div>

            <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
              ایجاد پشتیبانی
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SupportEdit;
