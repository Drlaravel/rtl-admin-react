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

interface HostFormData {
  username: string;
  password: string;
  link: string;
  expiry_date: string;
  reminder_date: string;
  space: string;
  company_name: string;
  price: number;
  purchase_type: 'ours' | 'customer';
  reminder: string;
  associated_with: 'project' | 'user' | '';
  project_id: number | null;
  user_id: number | null;
  shouldCreateInvoice: boolean;
}

interface OptionType {
  value: string | number;
  label: string;
}

const HostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<HostFormData>({
    defaultValues: {
      username: '',
      password: '',
      link: '',
      expiry_date: '',
      reminder_date: '',
      space: '',
      company_name: '',
      price: 0,
      purchase_type: 'ours',
      reminder: '0',
      associated_with: '',
      project_id: null,
      user_id: null,
      shouldCreateInvoice: false,
    }
  });

  const [users, setUsers] = useState<OptionType[]>([]);
  const [projects, setProjects] = useState<OptionType[]>([]);

  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning', confirmButtonText = 'باشه') => {
    return MySwal.fire({ title, text, icon, confirmButtonText });
  };

  const onSubmit = async (data: HostFormData) => {
    try {
      await api.put(`/api/hosts/${id}`, data);
      showAlert('موفقیت', 'هاست با موفقیت ویرایش شد.', 'success');
      reset();
      navigate('/hosts/list');
    } catch (error) {
      console.error('Error updating host:', error);
      showAlert('خطا!', 'ویرایش هاست با مشکل مواجه شد.', 'error');
    }
  };

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const response = await api.get(`/api/hosts/${id}`);
        const hostData = response.data.data;

        setValue('username', hostData.username);
        setValue('password', hostData.password);
        setValue('link', hostData.link);
        setValue('expiry_date', hostData.expiry_date);
        setValue('reminder_date', hostData.reminder_date);
        setValue('space', hostData.space);
        setValue('company_name', hostData.company_name);
        setValue('price', hostData.price);
        setValue('purchase_type', hostData.purchase_type);
        setValue('reminder', hostData.reminder ? '0' : '1');
        setValue('associated_with', hostData.project_id ? 'project' : hostData.user_id ? 'user' : '');
        setValue('project_id', hostData.project_id);
        setValue('user_id', hostData.user_id);
      } catch (error) {
        console.error('Error fetching host data:', error);
        showAlert('خطا!', 'دریافت اطلاعات هاست با مشکل مواجه شد.', 'error');
      }
    };

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

    fetchHostData();
    fetchAllData();
  }, [id, setValue]);

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
      <Breadcrumb pageName="ویرایش هاست" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">ویرایش هاست</h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نام کاربری</label>
                <input
                  type="text"
                  {...register('username', { required: 'نام کاربری الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.username ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="نام کاربری"
                />
                {errors.username && <p className="text-danger text-3 mt-2.5">{errors.username.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">رمز عبور</label>
                <input
                  type="password"
                  {...register('password', { required: 'رمز عبور الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.password ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="رمز عبور"
                />
                {errors.password && <p className="text-danger text-3 mt-2.5">{errors.password.message}</p>}
              </div>
            </div>

            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">لینک هاست</label>
                <input
                  type="text"
                  {...register('link', { required: 'لینک هاست الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.link ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="لینک هاست"
                />
                {errors.link && <p className="text-danger text-3 mt-2.5">{errors.link.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">فضای هاست</label>
                <input
                  type="text"
                  {...register('space', { required: 'فضای هاست الزامی است.' })}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.space ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="فضای هاست"
                />
                {errors.space && <p className="text-danger text-3 mt-2.5">{errors.space.message}</p>}
              </div>
            </div>

            <div className="my-4.5 grid md:grid-cols-2 gap-6">
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">تاریخ انقضا</label>
                <DatePicker
                  calendar={persian}
                  placeholder="تاریخ انقضا"
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.expiry_date ? 'border-red-500' : 'border-stroke'}`}
                  containerStyle={{ width: '100%' }}
                  onChange={(date) => setValue('expiry_date', date?.format() || '')}
                />
                {errors.expiry_date && <p className="text-danger text-3 mt-2.5">{errors.expiry_date.message}</p>}
              </div>

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">تاریخ یادآوری</label>
                <DatePicker
                  calendar={persian}
                  placeholder="تاریخ یادآوری"
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder_date ? 'border-red-500' : 'border-stroke'}`}
                  containerStyle={{ width: '100%' }}
                  onChange={(date) => setValue('reminder_date', date?.format() || '')}
                />
                {errors.reminder_date && <p className="text-danger text-3 mt-2.5">{errors.reminder_date.message}</p>}
              </div>
            </div>

            <div className="my-4.5 grid md:grid-cols-2 gap-6">
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

              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">یادآور</label>
                <select
                  {...register('reminder')}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.reminder ? 'border-red-500' : 'border-stroke'}`}
                >
                  <option value="0">فعال</option>
                  <option value="1">غیرفعال</option>
                </select>
              </div>
            </div>

            {purchaseType === 'customer' && (
              <div className="my-4.5">
                <label className="block mb-2.5 text-black dark:text-white">نام کمپانی</label>
                <input
                  type="text"
                  {...register('company_name')}
                  className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.company_name ? 'border-red-500' : 'border-stroke'}`}
                  placeholder="نام کمپانی"
                />
              </div>
            )}

            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">قیمت هاست</label>
              <input
                type="text"
                {...register('price')}
                className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors.price ? 'border-red-500' : 'border-stroke'}`}
                placeholder="قیمت هاست"
              />
              {errors.price && <p className="text-danger text-3 mt-2.5">{errors.price.message}</p>}
            </div>

            <div className="my-4.5">
              <label className="block mb-2.5 text-black dark:text-white">اضافه کردن به:</label>
              <select
                {...register('associated_with', { required: 'این فیلد الزامی است.' })}
                value={watch('associated_with')} // اضافه کردن value به‌عنوان مقدار انتخاب شده
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('associated_with', value);
                  if (value === 'project') {
                    setValue('user_id', null); // پاک کردن user_id اگر پروژه انتخاب شود
                  } else if (value === 'user') {
                    setValue('project_id', null); // پاک کردن project_id اگر کاربر انتخاب شود
                  } else {
                    setValue('project_id', null);
                    setValue('user_id', null);
                  }
                }}
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
              ویرایش هاست
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HostEdit;
